"use client";
import { Image } from "@imagekit/next";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [search, setSearch] = useState("");

  return (
    <nav className="w-full flex items-center justify-between px-6 py-9 bg-white border-b shadow-sm">
      {/* Esquerda: Barra de pesquisa */}
      <form
        className="flex items-center gap-2 w-1/3"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Button type="submit" variant="outline" size="sm">
          Buscar
        </Button>
      </form>

      {/* Centro: Logo */}
      <div className="flex-1 flex justify-center">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight select-none hover:drop-shadow-amber-950"
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

      {/* Direita: Auth e Carrinho */}
      <div className="flex items-center gap-4 w-1/3 justify-end">
        {!isSignedIn ? (
          <>
            <SignInButton mode="modal">
              <Button variant="outline">Entrar</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Criar conta</Button>
            </SignUpButton>
          </>
        ) : (
          <>
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Carrinho"
                className="w-12 h-12 flex items-center justify-center"
              >
                <ShoppingCart className="!w-7 !h-7" />
              </Button>
            </Link>
            <UserButton />
          </>
        )}
      </div>
    </nav>
  );
}
