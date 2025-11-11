import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";

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
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  // Alternativa SSR: usePathname() só funciona em client components
  const showNavbar = !pathname.startsWith("/admin");
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-br">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Navbar completa com Clerk */}
          <AppNavbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
