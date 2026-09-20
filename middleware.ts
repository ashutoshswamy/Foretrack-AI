import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

const PUBLIC_ROUTES = [
  /^\/$/,
  /^\/sign-in(\/.*)?$/,
  /^\/sign-up(\/.*)?$/,
  /^\/privacy$/,
  /^\/terms$/,
  /^\/cookies$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((re) => re.test(pathname));
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname) || pathname.startsWith("/api")) {
    // API routes verify the session cookie themselves (see lib/session.ts)
    // and return a proper 401 JSON response instead of a redirect.
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
