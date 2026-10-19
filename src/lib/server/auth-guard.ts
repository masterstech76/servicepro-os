import "server-only";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isRemoteSupabaseConfigured } from "@/lib/supabase/middleware";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import type { Database, UserRole } from "@/lib/supabase/types";

export interface AuthenticatedActor {
  authenticated: boolean;
  userId: string;
  role: UserRole;
  businessId: string;
  technicianId: string | null;
}

/**
 * Resolves the authenticated actor from:
 * 1. Request headers (`x-servicepro-role`, `x-servicepro-tech-id`) for internal/test callers
 * 2. Request cookies (`servicepro_dev_role`, `sp_demo_role`, `sp_demo_tech_id`)
 * 3. Next.js `cookies()` store in App Router handlers
 * 4. Supabase Auth SSR session when remote Supabase is configured
 */
export async function resolveRequestActor(
  request?: Request
): Promise<AuthenticatedActor | null> {
  const store = getLocalDbWithDemo();
  const defaultBizId =
    Array.from(store.businesses.values())[0]?.id ??
    "00000000-0000-4000-8000-000000000001";

  // 1. Check explicit headers (used in integration/RLS tests or service calls)
  if (request) {
    const headerRole = request.headers.get("x-servicepro-role") as
      | UserRole
      | "anon"
      | null;
    const headerTechId = request.headers.get("x-servicepro-tech-id");
    if (headerRole === "anon") {
      return null;
    }
    if (headerRole === "owner" || headerRole === "technician") {
      return {
        authenticated: true,
        userId: headerRole === "owner" ? "user_owner" : `user_${headerTechId ?? "tech-carlos"}`,
        role: headerRole,
        businessId: defaultBizId,
        technicianId: headerRole === "technician" ? headerTechId ?? "tech-carlos" : null,
      };
    }

    // 2. Parse Cookie header on incoming Request
    const cookieHeader = request.headers.get("cookie") ?? "";
    if (cookieHeader) {
      const parsedCookies = Object.fromEntries(
        cookieHeader.split(";").map((part) => {
          const [k, ...v] = part.trim().split("=");
          return [k, decodeURIComponent(v.join("="))];
        })
      );
      const cookieRole = (parsedCookies["servicepro_dev_role"] ||
        parsedCookies["sp_demo_role"]) as UserRole | undefined;
      const cookieTechId = parsedCookies["sp_demo_tech_id"] || "tech-carlos";
      if (cookieRole === "owner" || cookieRole === "technician") {
        return {
          authenticated: true,
          userId: cookieRole === "owner" ? "user_owner" : `user_${cookieTechId}`,
          role: cookieRole,
          businessId: defaultBizId,
          technicianId: cookieRole === "technician" ? cookieTechId : null,
        };
      }
    }
  }

  // 3. Check Next.js cookies() store
  try {
    const cookieStore = cookies();
    const roleCookie = (cookieStore.get("servicepro_dev_role")?.value ||
      cookieStore.get("sp_demo_role")?.value) as UserRole | undefined;
    const techIdCookie =
      cookieStore.get("sp_demo_tech_id")?.value || "tech-carlos";

    if (roleCookie === "owner" || roleCookie === "technician") {
      return {
        authenticated: true,
        userId: roleCookie === "owner" ? "user_owner" : `user_${techIdCookie}`,
        role: roleCookie,
        businessId: defaultBizId,
        technicianId: roleCookie === "technician" ? techIdCookie : null,
      };
    }

    // 4. Remote Supabase Auth session
    if (isRemoteSupabaseConfigured()) {
      const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll() {
              // read-only in route guard
            },
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, business_id, technician_id")
          .eq("id", user.id)
          .single();

        const p = profile as {
          role: UserRole;
          business_id: string;
          technician_id: string | null;
        } | null;

        if (p) {
          return {
            authenticated: true,
            userId: user.id,
            role: p.role,
            businessId: p.business_id,
            technicianId: p.technician_id,
          };
        }
      }
    }
  } catch {
    // cookies() called outside request context (e.g., direct function call)
  }

  // Default fallback for local development when no explicit anon header was sent
  if (process.env.NODE_ENV !== "production" || !isRemoteSupabaseConfigured()) {
    return {
      authenticated: true,
      userId: "user_owner",
      role: "owner",
      businessId: defaultBizId,
      technicianId: null,
    };
  }

  return null;
}

export async function requireRole(
  request: Request,
  allowedRoles: UserRole[]
): Promise<
  | { ok: true; actor: AuthenticatedActor }
  | { ok: false; response: NextResponse }
> {
  const actor = await resolveRequestActor(request);
  if (!actor) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication is required to access this resource.",
          },
        },
        { status: 401 }
      ),
    };
  }

  if (!allowedRoles.includes(actor.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: `Role '${actor.role}' is not permitted to perform this action.`,
          },
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, actor };
}
