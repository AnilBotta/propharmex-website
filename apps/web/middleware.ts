import { NextResponse, type NextRequest } from "next/server";

/**
 * Forwards the incoming request pathname as `x-pathname` so server components
 * can read it via `headers()`. RootLayout uses this to suppress marketing
 * chrome (Header, Footer, Concierge, Analytics) on /studio.
 *
 * Matcher excludes Next internals and static assets to avoid rewriting
 * unnecessary requests. Marketing routes pass through with the header set;
 * /studio gets it too so RootLayout can branch.
 */
export function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Run on every path except _next, static files, favicon, and the
    // Sentry tunnel route (which has its own contract).
    "/((?!_next/static|_next/image|favicon\\.ico|monitoring).*)",
  ],
};
