import { NextResponse } from "next/server";

/**
 * Validates Origin / Referer headers against expected application hosts
 * to protect state-changing mutation endpoints against Cross-Site Request Forgery (CSRF).
 */
export function verifyCsrfOrigin(request: Request): { valid: boolean; response?: NextResponse } {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  // Non-browser or server-to-server requests without origin/referer
  if (!origin && !referer) {
    return { valid: true };
  }

  const allowedOrigins: string[] = [
    "https://heavenlease.in",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  if (host) {
    allowedOrigins.push(`http://${host}`, `https://${host}`);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      const parsed = new URL(appUrl);
      allowedOrigins.push(parsed.origin);
    } catch {
      // ignore parsing error
    }
  }

  if (origin) {
    const isAllowed = allowedOrigins.some(
      (allowed) => origin === allowed || origin.endsWith(`.${host?.split(":")[0]}`)
    );
    if (!isAllowed) {
      return {
        valid: false,
        response: NextResponse.json(
          { error: { code: "CSRF_FORBIDDEN", message: "Cross-origin request rejected." } },
          { status: 403 }
        ),
      };
    }
  }

  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      const isAllowed = allowedOrigins.some(
        (allowed) => refOrigin === allowed || refOrigin.includes(host?.split(":")[0] || "")
      );
      if (!isAllowed) {
        return {
          valid: false,
          response: NextResponse.json(
            { error: { code: "CSRF_FORBIDDEN", message: "Cross-origin request rejected." } },
            { status: 403 }
          ),
        };
      }
    } catch {
      return {
        valid: false,
        response: NextResponse.json(
          { error: { code: "CSRF_FORBIDDEN", message: "Invalid referer header." } },
          { status: 403 }
        ),
      };
    }
  }

  return { valid: true };
}
