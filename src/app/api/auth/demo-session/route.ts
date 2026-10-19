import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { verifyCsrfOrigin } from "@/lib/server/csrf";

export async function POST(request: Request) {
  // 1. CSRF Protection
  const csrf = verifyCsrfOrigin(request);
  if (!csrf.valid && csrf.response) {
    return csrf.response;
  }

  // 2. Rate Limiting (max 15 session updates per minute per IP)
  const rl = checkRateLimit(request, { limit: 15, windowMs: 60_000, keyPrefix: "auth_demo_session" });
  if (!rl.allowed && rl.response) {
    return rl.response;
  }

  // 3. Optional production lock: Disallow demo sessions if ALLOW_DEMO_AUTH=false
  if (process.env.ALLOW_DEMO_AUTH === "false") {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Demo authentication is disabled in this environment.",
        },
      },
      { status: 403 }
    );
  }

  const body = (await request.json()) as {
    role?: "owner" | "admin" | "technician" | "customer" | "clear";
    technicianId?: string;
  };

  const response = NextResponse.json({
    ok: true,
    role: body.role ?? "owner",
    technicianId: body.technicianId ?? "tech-carlos",
  });

  if (body.role === "clear") {
    response.cookies.delete("servicepro_dev_role");
    response.cookies.delete("sp_demo_role");
    response.cookies.delete("sp_demo_tech_id");
    return response;
  }

  const role = body.role ?? "owner";
  response.cookies.set("servicepro_dev_role", role, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("sp_demo_role", role, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (body.technicianId) {
    response.cookies.set("sp_demo_tech_id", body.technicianId, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}
