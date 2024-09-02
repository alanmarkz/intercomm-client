import { NextResponse, type NextRequest } from "next/server";
import axios from "axios";
export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;
  const currentUrl = request.nextUrl;
  const currentPath = currentUrl.pathname;
  const fullUrl = currentUrl.toString();

  const allowedRoutes = [
    "/api/auth",
    "/callback",
    "/login",
    "/manifest.json",
    "/icon-192x192.png",
    "/icon-384x384.png",
    "/icon-512x512.png",
  ];

  // Check if the current path or full URL is in the allowedRoutes list
  const isAllowedRoute = allowedRoutes.some(
    (route) => currentPath === route || fullUrl.startsWith(route)
  );

  if (!isAllowedRoute && !authToken) {
    return NextResponse.redirect(new URL(`/login`, currentUrl));
  }

  if (isAllowedRoute && authToken) {
    const isTokenValid = await checkToken(authToken);

    if (isTokenValid) return NextResponse.redirect(new URL(`/`, currentUrl));
  }

  if (!isAllowedRoute && authToken) {
    const isTokenValid = await checkToken(authToken);

    if (!isTokenValid)
      return NextResponse.redirect(new URL(`/login`, currentUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export async function checkToken(authToken: string) {
  try {
    const response = await axios.post(
      "http://192.168.0.109:8080/validatetoken",
      {
        authToken,
      }
    );

    if (response.data) {
      return true;
    }
    return response.data; // Handle the response as needed
  } catch (error) {
    return false;
  }
}
