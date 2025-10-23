"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { ProductDB } from "@/types/product";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<ProductDB | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          toast.error("Produto não encontrado");
          router.push("/products");
        }
      } catch (error) {
        console.error("[v0] Error fetching product:", error);
        toast.error("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product._id || "",
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        stock: product.stock,
      });
    }
    toast.success("Produto adicionado!", {
      description: `${quantity}x ${product.name} adicionado ao carrinho.`,
    });
  };

  const incrementQuantity = () => {
    if (product && quantity < (product.stock || 99)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-geral flex items-center justify-center">
        <div className="text-primaria text-lg">Carregando produto...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-geral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 text-primaria hover:bg-primaria/10 hover:text-primaria transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Product Image - takes up left half on desktop */}
          <div className="lg:flex-1 lg:sticky lg:top-8 lg:self-start">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <Badge className="absolute top-4 right-4 bg-secondaria text-primaria font-semibold border-0 shadow-md">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Product Info - takes up right half on desktop */}
          <div className="lg:flex-1 flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold text-primaria mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <p className="text-4xl font-bold text-secondaria">
                R$ {product.price.toFixed(2)}
              </p>
              {product.stock !== undefined && (
                <p className="text-sm text-primaria/60 mt-2">
                  {product.stock} unidades em estoque
                </p>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-primaria mb-2">
                Descrição
              </h2>
              <p className="text-primaria/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.details && product.details.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-primaria mb-2">
                  Detalhes do Produto
                </h2>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li
                      key={index}
                      className="text-primaria/70 text-sm flex items-start"
                    >
                      <span className="mr-2 text-secondaria">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mb-6">
              <label className="text-sm font-medium text-primaria mb-2 block">
                Quantidade
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="border-primaria/30 text-primaria hover:bg-primaria hover:text-white hover:border-primaria disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primaria transition-all duration-200 bg-transparent"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center text-primaria">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.stock || 99)}
                  className="border-primaria/30 text-primaria hover:bg-primaria hover:text-white hover:border-primaria disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primaria transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Button
                size="lg"
                className="flex-1 bg-secondaria text-primaria hover:bg-secondaria/90 hover:shadow-lg font-semibold transition-all duration-200"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Link href="/cart" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primaria text-primaria hover:bg-primaria hover:text-white hover:shadow-lg transition-all duration-200 bg-transparent"
                >
                  Ver Carrinho
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
