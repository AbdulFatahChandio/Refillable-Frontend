// import { NextResponse, NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {

//   const token = request.cookies.get('_ca')?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL('/signin', request.url))
//   }


// }

// export const config = {
//   matcher: ['/dashboard/:path*'],
// }


import { NextResponse, NextRequest } from "next/server";

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    if (typeof payload.exp !== "number") return true;

    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("_ca")?.value;
  const hasValidToken = isTokenValid(token);
  const { pathname } = request.nextUrl;

  // 🔒 Protected routes (require login)
  const protectedRoutes = ["/dashboard"];

  // 🚫 Auth routes (should not be accessible when logged in)
  const authRoutes = ["/signin", "/signup", "/forgot-password", "/reset-password", "/verify"];

  // Clear expired tokens so client-side auth checks don't fire unnecessary requests
  if (token && !hasValidToken) {
    const response = NextResponse.next();
    response.cookies.delete("_ca");
    return response;
  }

  // 1️⃣ If user is NOT logged in and visiting protected route → redirect to signin
  if (!hasValidToken && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2️⃣ If user IS logged in and visiting auth routes → redirect to home
  if (hasValidToken && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify",
  ],
};
