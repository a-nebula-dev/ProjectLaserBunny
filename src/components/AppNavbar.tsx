"use client";
import Navbar from "@/components/Navbar/Navbar";
import { usePathname } from "next/navigation";

export default function AppNavbar() {
  const pathname = usePathname();
  // Só mostra Navbar se não estiver em /admin
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}
