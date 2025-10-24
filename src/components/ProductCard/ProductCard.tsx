"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Image } from "@imagekit/next";

interface ProductCardProps {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
}: ProductCardProps) {
  return (
    <Link href={`/products/${encodeURIComponent(id)}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-primaria/10 cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-geral">
          <Image
            urlEndpoint="https://ik.imagekit.io/NebulaDev"
            src="/default-image.jpg"
            alt="Studio a laser coelho"
            width={50}
            height={50}
            className="object-contain w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
            priority
          />
          <div className="absolute top-3 right-3 bg-secondaria text-primaria text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-primaria mb-2 transition-all duration-300 group-hover:text-secondaria line-clamp-2">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-secondaria">
              R$ {price.toFixed(2)}
            </span>

            <Button
              size="sm"
              className="bg-secondaria text-primaria hover:bg-secondaria/90 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault(); // impede navegação quando clicar no botão do carrinho dentro do card
                // Aqui tu pode despachar uma ação de "add to mini-cart" se quiser
              }}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
