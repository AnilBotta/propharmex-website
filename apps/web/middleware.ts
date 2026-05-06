import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge-compatible middleware. Two responsibilities:
 *
 *  1. Forward the incoming request pathname as `x-pathname` so server
 *     components can read it via `headers()`. RootLayout uses this to
 *     suppress marketing chrome on /studio AND /dashboard.
 *
 *  2. Refresh the Supabase auth session on every request to /dashboard/*
 *     and gate access. The Supabase SSR helper rotates expiring tokens
 *     by writing fresh cookies onto the response. If there's no session
 *     (or we couldn't construct a client because env keys are missing),
 *     we redirect to /dashboard/login.
 *
 * Public dashboard surfaces (no session required): /dashboard/login.
 * /api/auth/* routes are not gated here — they manage their own access.
 */
export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const isPublicSurface =
      req.nextUrl.pathname === "/dashboard/login" ||
      req.nextUrl.pathname.startsWith("/dashboard/login/");

    if (!isPublicSurface) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !anonKey) {
        // Misconfigured deploy — bounce to login with a recognizable error.
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/dashboard/login";
        loginUrl.search = "?error=config";
        return NextResponse.redirect(loginUrl);
      }

      const supabase = createServerClient(url, anonKey, {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/dashboard/login";
        loginUrl.search = "";
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Run on every path except _next, static files, favicon, and the
    // Sentry tunnel route (which has its own contract).
    "/((?!_next/static|_next/image|favicon\\.ico|monitoring).*)",
  ],
};
