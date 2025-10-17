"use client";
import { Image } from "@imagekit/next";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-9 bg-white border-b shadow-sm">
        <form
          className="hidden md:flex items-center gap-2 w-1/3"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-5 rounded-full border border-gray-300 focus:border-primaria focus:ring-primaria shadow-black shadow-2xl"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="hover:text-white hover:bg-primaria hover:cursor-pointer transition-all duration-500 shadow-2xl shadow-black bg-transparent"
          >
            Buscar
          </Button>
        </form>

        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-6">
                {/* Search in mobile menu */}
                <form
                  className="flex flex-col gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-5 rounded-full border border-gray-300 focus:border-primaria focus:ring-primaria shadow-black shadow-2xl"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="hover:text-white hover:bg-primaria hover:cursor-pointer transition-all duration-500 shadow-2xl shadow-black bg-transparent"
                  >
                    Buscar
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Centro: Logo - always visible, adjusted flex for mobile */}
        <div className="flex-1 flex justify-center md:flex-1">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight select-none hover:shadow-2xl hover:cursor-pointer transition-all duration-500 hover:ring-primaria"
          >
            <Image
              urlEndpoint="https://ik.imagekit.io/NebulaDev"
              src="/laserBunnyLogo.png"
              alt="Studio a laser coelho"
              width={70}
              height={20}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4 w-1/3 justify-end">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="shadow-2xl shadow-black hover:cursor-pointer transition-all duration-500 hover:bg-primaria hover:text-white bg-transparent"
                >
                  Entrar
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-primaria shadow-2xl shadow-blue-800 hover:cursor-pointer transition-all duration-300">
                  Criar conta
                </Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Carrinho"
                  className="w-12 h-12 flex items-center justify-center text-primaria hover:cursor-pointer hover:bg-primaria hover:text-white transition-all duration-500 shadow-2xl shadow-black"
                >
                  <ShoppingCart className="!w-7 !h-7" />
                </Button>
              </Link>
              <div className="scale-130 ps-5">
                <UserButton />
              </div>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="sm"
                className="shadow-2xl shadow-black hover:cursor-pointer transition-all duration-500 hover:bg-primaria hover:text-white bg-transparent"
              >
                Entrar
              </Button>
            </SignInButton>
          ) : (
            <div className="scale-110">
              <UserButton />
            </div>
          )}
        </div>
      </nav>

      {mounted && isSignedIn && (
        <Link href="/cart" className="md:hidden fixed bottom-6 right-6 z-50">
          <Button
            size="icon"
            aria-label="Carrinho"
            className="w-14 h-14 rounded-full bg-primaria text-white shadow-2xl shadow-black hover:cursor-pointer hover:scale-110 transition-all duration-300"
          >
            <ShoppingCart className="w-7 h-7" />
          </Button>
        </Link>
      )}
    </>
  );
}
