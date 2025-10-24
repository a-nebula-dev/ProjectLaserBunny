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

  const categories = [
    { name: "Novidades", href: "/products" },
    { name: "Decoração", href: "/products" },
    { name: "Presentes", href: "/products" },
    { name: "Promoções", href: "/products" },
    { name: "Personalizados", href: "/products" },
  ];

  return (
    <>
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5 sm:py-10 bg-(--color-geral) border-b-4 border-(--color-secondaria)">
        {/* Left: Search - Hidden on mobile, shown on md+ */}
        <form
          className="hidden md:flex items-center gap-2 w-full md:w-1/3 lg:w-2/5"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 lg:px-4 py-2 rounded-full border border-gray-300 bg-white focus:border-(--color-secondaria) focus:ring-(--color-secondaria) text-sm text-(--color-primaria) transition-all duration-300"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="rounded-full px-3 lg:px-4 border-gray-300 hover:bg-(--color-secondaria) hover:text-white hover:border-(--color-secondaria) transition-all duration-300 bg-white text-(--color-primaria) whitespace-nowrap"
          >
            Buscar
          </Button>
        </form>

        {/* Mobile menu button - Only visible on mobile */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                className="text-(--color-primaria) hover:bg-(--color-secondaria)/10 transition-all duration-300"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] sm:w-[320px] bg-(--color-geral)"
            >
              <SheetHeader>
                <SheetTitle className="text-(--color-primaria) text-left">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-6">
                <form
                  className="flex flex-col gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 bg-white text-(--color-primaria) transition-all duration-300"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="rounded-full hover:bg-(--color-secondaria) hover:text-white transition-all duration-300 bg-white text-(--color-primaria) border-(--color-primaria)"
                  >
                    Buscar
                  </Button>
                </form>

                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-(--color-primaria) mb-2">
                    Categorias
                  </h3>
                  {categories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-(--color-primaria) hover:text-(--color-secondaria) font-medium transition-all duration-300 py-2 px-3 rounded-lg hover:bg-(--color-secondaria)/10"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                {!isSignedIn && (
                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                    <SignUpButton mode="modal">
                      <Button className="w-full rounded-full bg-(--color-secondaria) hover:bg-(--color-primaria) text-white transition-all duration-300">
                        Criar conta
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Center: Logo - Responsive sizing */}
        <div className="flex-1 flex justify-center md:flex-none md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <Link
            href="/"
            className="cursor-pointer hover:scale-110 transition-all duration-300"
          >
            <Image
              urlEndpoint="https://ik.imagekit.io/NebulaDev"
              src="/laserBunnyLogo.png"
              alt="Studio a laser coelho"
              width={50}
              height={50}
              className="object-contain w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
              priority
            />
          </Link>
        </div>

        {/* Right: Cart and User - Responsive */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 w-1/3 lg:w-2/5 justify-end">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-(--color-primaria) hover:bg-(--color-secondaria) hover:text-white hover:border-(--color-secondaria) transition-all duration-300 bg-white text-(--color-primaria) text-xs lg:text-sm px-3 lg:px-4"
                >
                  Entrar
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="rounded-full bg-(--color-secondaria) hover:bg-(--color-primaria) text-white transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4"
                >
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
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-full hover:bg-(--color-secondaria) hover:text-white transition-all duration-300 text-(--color-primaria)"
                >
                  <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
              </Link>
              <div className="scale-100 lg:scale-110">
                <UserButton />
              </div>
            </>
          )}
        </div>

        {/* Mobile: Auth buttons - Only show login button */}
        <div className="md:hidden flex items-center gap-2">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full hover:bg-(--color-secondaria) hover:text-white transition-all duration-300 bg-white text-(--color-primaria) border-(--color-primaria) text-xs px-3"
              >
                Entrar
              </Button>
            </SignInButton>
          ) : (
            <div className="scale-90 sm:scale-100">
              <UserButton />
            </div>
          )}
        </div>
      </nav>

      <div className="w-full bg-primaria border-b border-gray-200 py-2">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden md:block">
          <ul className="flex items-center justify-start md:justify-center gap-4 sm:gap-6 lg:gap-8 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <li key={category.href} className="flex-shrink-0">
                <Link
                  href={category.href}
                  className="text-secondaria hover:text-white font-medium transition-all duration-300 text-xs sm:text-sm lg:text-base whitespace-nowrap"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile floating cart button - Only shown when signed in */}
      {mounted && isSignedIn && (
        <Link href="/cart" className="md:hidden fixed bottom-6 right-6 z-50">
          <Button
            size="icon"
            aria-label="Carrinho"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-(--color-secondaria) hover:bg-(--color-primaria) text-white shadow-lg transition-all duration-300 hover:scale-110"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </Link>
      )}
    </>
  );
}
