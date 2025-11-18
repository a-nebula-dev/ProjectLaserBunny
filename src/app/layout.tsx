import { Suspense } from "react";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import { ClerkErrorBoundary } from "@/components/ClerkErrorBoundary";
import AuthModalTrigger from "@/components/AuthModalTrigger";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arte a Laser Coelho",
  description: "desenvolvido por a-nebula-dev no github",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Explicitly pass known Clerk env values to the provider. In production
  // Clerk may not be able to auto-detect configuration and can timeout
  // while trying to load its JS. Supplying the publishable key / frontend
  // api prevents that.
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If you use a custom proxy or host for Clerk's JS (seen in the console as
  // https://clerk.artelasercoelho.com/...), set NEXT_PUBLIC_CLERK_JS_URL or
  // NEXT_PUBLIC_CLERK_PROXY_URL in your env. We prefer an explicit clerkJSUrl
  // so the SDK doesn't attempt auto-detection which can fail in production
  // or with custom proxies.
  const clerkJSUrlEnv = process.env.NEXT_PUBLIC_CLERK_JS_URL;
  const clerkProxy = process.env.NEXT_PUBLIC_CLERK_PROXY_URL;
  const clerkJSUrl =
    clerkJSUrlEnv ||
    (clerkProxy
      ? `${clerkProxy.replace(
          /\/+$/,
          ""
        )}/npm/@clerk/clerk-js@5/dist/clerk.browser.js`
      : undefined);

  return (
    <ClerkProvider
      localization={ptBR}
      publishableKey={publishableKey}
      clerkJSUrl={clerkJSUrl}
    >
      <ClerkErrorBoundary>
        <html lang="pt-br">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {/* Navbar completa com Clerk */}
            <AppNavbar />
            <Suspense fallback={null}>
              <AuthModalTrigger />
            </Suspense>
            {children}
          </body>
        </html>
      </ClerkErrorBoundary>
    </ClerkProvider>
  );
}
