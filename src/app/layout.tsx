import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-br">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Navbar completa com Clerk */}
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
