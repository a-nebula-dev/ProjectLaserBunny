"use client";
import React from "react";

import Carrosel from "@/components/carrosel/Carrosel";
import ProductCard from "@/components/ProductCard/ProductCard";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  const products = [
    {
      id: 1,
      name: "Produto Artesanal 1",
      price: 89.9,
      image: "/handmade-craft-product.jpg",
      category: "Novidades",
    },
    {
      id: 2,
      name: "Decoração Especial",
      price: 129.9,
      image: "/home-decoration-item.jpg",
      category: "Decoração",
    },
    {
      id: 3,
      name: "Presente Único",
      price: 159.9,
      image: "/unique-gift-box.jpg",
      category: "Presentes",
    },
    {
      id: 4,
      name: "Item Personalizado",
      price: 199.9,
      image: "/personalized-item.jpg",
      category: "Personalizados",
    },
    {
      id: 5,
      name: "Oferta Especial",
      price: 79.9,
      image: "/special-offer-product.jpg",
      category: "Promoções",
    },
    {
      id: 6,
      name: "Artesanato Premium",
      price: 249.9,
      image: "/premium-handcraft.jpg",
      category: "Novidades",
    },
    {
      id: 7,
      name: "Decoração Moderna",
      price: 169.9,
      image: "/modern-decor.jpg",
      category: "Decoração",
    },
    {
      id: 8,
      name: "Kit Presente",
      price: 299.9,
      image: "/gift-set-bundle.jpg",
      category: "Presentes",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* <h1 className="text-2xl font-bold mb-6">Teste de Upload com ImageKit</h1> */}
      {/* <ImageKitUpload /> */}

      <Carrosel />

      <div className="min-h-screen bg-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primaria)] mb-3">
              Produtos em Destaque
            </h2>
            <p className="text-[var(--color-primaria)]/70 text-base sm:text-lg">
              Explore nossa seleção especial de produtos artesanais
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </main>
  );
}
