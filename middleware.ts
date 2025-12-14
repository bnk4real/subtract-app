import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/subscriptions"];
const SESSION_COOKIE_NAME = "subtrack_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/subscriptions/:path*"],
};
