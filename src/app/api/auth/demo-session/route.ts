import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("sp_demo_role", role, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (body.technicianId) {
    response.cookies.set("sp_demo_tech_id", body.technicianId, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}
