import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database, UserRole } from "./types";

export function isRemoteSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    url.startsWith("https://") &&
    !url.includes("placeholder") &&
    !url.includes("your-project") &&
    !url.includes("example") &&
    anonKey.length > 40 &&
    !anonKey.endsWith("...")
  );
}

export async function updateSessionAndEnforceRoles(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isTechRoute = pathname.startsWith("/tech");
  const isLoginRoute = pathname === "/login";

  if (!isAdminRoute && !isTechRoute && !isLoginRoute) {
    return supabaseResponse;
  }

  let role: UserRole | null = null;

  // Support demo / local dev session cookie
  const devRoleCookie = request.cookies.get("servicepro_dev_role")?.value as UserRole | undefined;
  if (devRoleCookie === "owner" || devRoleCookie === "technician") {
    role = devRoleCookie;
  } else if (isRemoteSupabaseConfigured()) {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
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
        .select("role")
        .eq("id", user.id)
        .single();
      role = (profile as { role?: UserRole } | null)?.role ?? null;
    }
  }

  // Unauthenticated access to /admin or /tech -> redirect to /login
  if (!role && (isAdminRoute || isTechRoute)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user visiting /login -> redirect to their home surface
  if (role && isLoginRoute) {
    const dest = request.nextUrl.clone();
    dest.pathname = role === "owner" ? "/admin" : "/tech";
    return NextResponse.redirect(dest);
  }

  // Wrong-role access -> 403 page (BUILD_PLAN Section 19)
  if (role === "technician" && isAdminRoute) {
    return new NextResponse("403 Forbidden — Owner access required", {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (role === "owner" && isTechRoute) {
    return new NextResponse("403 Forbidden — Technician access required", {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return supabaseResponse;
}
