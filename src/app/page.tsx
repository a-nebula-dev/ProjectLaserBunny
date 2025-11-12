"use client";
import React, { useState, useEffect } from "react";
import Carrosel from "@/components/carrosel/Carrosel";
import Footer from "@/components/Footer/Footer";
import ProductCard from "@/components/ProductCard/ProductCard";
import type { Product } from "@/types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          // set all products returned from the API
          setProducts(data.data || []);
        } else {
          console.error("Failed to fetch products", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Carrosel />

      <div className="min-h-16 bg-white w-full">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primaria)] mb-3">
              Produtos em Destaque
            </h2>
            <p className="text-[var(--color-primaria)]/70 text-base sm:text-lg">
              Explore nossa seleção especial de produtos artesanais
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg border border-primaria/20">
              <p className="text-primaria/70 text-lg">Carregando produtos...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard
                  key={(p as any).id || (p as any)._id}
                  id={(p as any).id || (p as any)._id}
                  name={(p as any).name || "Produto"}
                  price={Number((p as any).price) || 0}
                  image={(p as any).image || "/default-image.jpg"}
                  category={(p as any).category || ""}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-primaria/20">
              <p className="text-primaria/70 text-lg mb-4 mx-auto w-full">
                Nenhum produto encontrado
              </p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </main>
  );
}
