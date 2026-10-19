import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database, UserRole } from "./types";
import { sanitizeRedirectUrl, getHomeForRole } from "@/lib/server/redirect-safety";

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
  const isAccountRoute = pathname.startsWith("/account");
  const isAuthEntryRoute = pathname === "/login" || pathname === "/register";

  // If not a protected or auth entry route, continue immediately
  if (!isAdminRoute && !isTechRoute && !isAccountRoute && !isAuthEntryRoute) {
    return supabaseResponse;
  }

  let role: UserRole | null = null;

  // 1. Support demo / local dev session cookie
  const devRoleCookie = (request.cookies.get("servicepro_dev_role")?.value ||
    request.cookies.get("sp_demo_role")?.value) as UserRole | undefined;

  if (
    devRoleCookie === "owner" ||
    devRoleCookie === "admin" ||
    devRoleCookie === "technician" ||
    devRoleCookie === "customer"
  ) {
    role = devRoleCookie === "admin" ? "owner" : devRoleCookie;
  } else if (isRemoteSupabaseConfigured()) {
    // 2. Remote Supabase session verification
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
      const resolved = (profile as { role?: UserRole } | null)?.role ?? null;
      role = resolved === "admin" ? "owner" : resolved;
    }
  }

  // 3. Unauthenticated access to protected routes -> redirect to /login
  if (!role && (isAdminRoute || isTechRoute || isAccountRoute)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Authenticated user visiting /login or /register -> route safely
  if (role && isAuthEntryRoute) {
    const rawRedirect = request.nextUrl.searchParams.get("redirectTo");
    const defaultHome = getHomeForRole(role);
    const targetPath = sanitizeRedirectUrl(rawRedirect, defaultHome);

    const dest = request.nextUrl.clone();
    dest.pathname = targetPath.split("?")[0];
    const queryPart = targetPath.split("?")[1];
    if (queryPart) {
      dest.search = queryPart;
    } else {
      dest.search = "";
    }
    return NextResponse.redirect(dest);
  }

  // 5. Role-based route enforcement
  // /admin requires owner (admin) role
  if (isAdminRoute && role !== "owner") {
    const unauthUrl = request.nextUrl.clone();
    unauthUrl.pathname = "/unauthorized";
    unauthUrl.searchParams.set("required", "admin");
    unauthUrl.searchParams.set("current", role ?? "unknown");
    return NextResponse.redirect(unauthUrl);
  }

  // /tech requires technician role
  if (isTechRoute && role !== "technician") {
    const unauthUrl = request.nextUrl.clone();
    unauthUrl.pathname = "/unauthorized";
    unauthUrl.searchParams.set("required", "tech");
    unauthUrl.searchParams.set("current", role ?? "unknown");
    return NextResponse.redirect(unauthUrl);
  }

  return supabaseResponse;
}
