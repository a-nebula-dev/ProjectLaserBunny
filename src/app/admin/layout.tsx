import type React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Tags, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--color-geral)]">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--color-primaria)]/20 bg-white">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-[var(--color-primaria)]/20 p-6">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primaria)]">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[var(--color-primaria)]">
                  Admin Panel
                </h1>
                <p className="text-xs text-[var(--color-primaria)]/60">
                  Laser Bunny
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--color-primaria)] transition-colors hover:bg-[var(--color-primaria)]/5"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--color-primaria)] transition-colors hover:bg-[var(--color-primaria)]/5"
            >
              <Package className="h-5 w-5" />
              <span className="font-medium">Products</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--color-primaria)] transition-colors hover:bg-[var(--color-primaria)]/5"
            >
              <Tags className="h-5 w-5" />
              <span className="font-medium">Categories</span>
            </Link>
          </nav>

          {/* Sign Out */}
          <div className="border-t border-[var(--color-primaria)]/20 p-4">
            <SignOutButton>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-[var(--color-primaria)]/20 text-[var(--color-primaria)] hover:bg-[var(--color-primaria)]/5 bg-transparent"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </Button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}
