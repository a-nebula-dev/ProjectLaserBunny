import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  // Proteger rotas /admin (exceto /admin-login)
  if (pathname.startsWith("/admin") && pathname !== "/admin-login") {
    const authCookie = request.cookies.get("admin_auth");

    // Se não está autenticado, redirecionar para login
    if (authCookie?.value !== "true") {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  // Permitir requisição prosseguir
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
