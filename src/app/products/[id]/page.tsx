"use client";

import { Image } from "@imagekit/next";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import {
  ShoppingCart,
  Heart,
  CreditCard,
  Smartphone,
  Receipt,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.data);
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
        id: product.id || "",
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        stock: product.stock,
      });
    }
    toast.success("Produto adicionado ao carrinho!", {
      description: `${quantity}x ${product.name}`,
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

  const pixDiscount = 0.08; // 8% discount
  const boletoDiscount = 0.05; // 5% discount
  const pixPrice = product.price * (1 - pixDiscount);
  const boletoPrice = product.price * (1 - boletoDiscount);
  const pixSavings = product.price - pixPrice;
  const boletoSavings = product.price - boletoPrice;

  // Mock multiple images (in real app, product would have multiple images)
  const productImages = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-geral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-primaria mb-2">
            {product.name}
          </h1>
          <p className="text-sm text-primaria/60">
            Cod. do Produto: {product.id}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 flex gap-4">
            {/* Thumbnail column */}
            <div className="flex flex-col gap-3 w-20">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-secondaria shadow-md"
                      : "border-primaria/20 hover:border-primaria/40"
                  }`}
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
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-primaria/60"
                  }`}
                />
              </button>
              <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg border border-primaria/10">
                <img
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col">
            {/* Main price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-primaria">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
              <a
                href="#"
                className="text-sm text-secondaria hover:underline font-medium"
              >
                Mais formas de pagamento
              </a>
            </div>

            <Separator className="mb-6 bg-primaria/10" />

            <div className="space-y-4 mb-6">
              {/* Credit card */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-primaria/10">
                <CreditCard className="w-5 h-5 text-primaria mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-primaria">
                    <span className="font-semibold">1x</span> de{" "}
                    <span className="font-semibold">
                      R$ {product.price.toFixed(2)}
                    </span>{" "}
                    no cartão de crédito
                  </p>
                </div>
              </div>

              {/* PIX discount */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondaria/10 border border-secondaria/30">
                <Smartphone className="w-5 h-5 text-secondaria mt-0.5" />
                <div className="flex-1">
                  <p className="text-lg font-bold text-primaria mb-1">
                    R$ {pixPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-primaria">
                    à vista no pix{" "}
                    <span className="font-semibold">(8% Desconto)</span>
                  </p>
                  <p className="text-xs text-secondaria font-medium mt-1">
                    Economize R$ {pixSavings.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Boleto discount */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-primaria/10">
                <Receipt className="w-5 h-5 text-primaria mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-primaria">
                    <span className="font-semibold">
                      R$ {boletoPrice.toFixed(2)}
                    </span>{" "}
                    à vista no boleto{" "}
                    <span className="font-semibold">(5% Desconto)</span>
                  </p>
                  <p className="text-xs text-primaria/60 mt-1">
                    Economize R$ {boletoSavings.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="mb-6 bg-primaria/10" />

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-primaria/30 rounded-lg overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-4 py-3 text-primaria hover:bg-primaria/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-3 font-semibold text-primaria border-x border-primaria/30 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.stock || 99)}
                  className="px-4 py-3 text-primaria hover:bg-primaria/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  +
                </button>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-[52px] shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                COMPRAR
              </Button>

              <div className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold whitespace-nowrap">
                <Shield className="w-4 h-4" />
                <div className="leading-tight">
                  <div>LOJA 100%</div>
                  <div>SEGURA</div>
                </div>
              </div>
            </div>

            {/* WhatsApp button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full border-primaria/30 text-primaria hover:bg-primaria/5 font-medium bg-transparent"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Compre Pelo WhatsApp
            </Button>

            {/* Product description */}
            {product.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-primaria mb-3">
                  Descrição do Produto
                </h2>
                <p className="text-primaria/70 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product details */}
            {product.details && product.details.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold text-primaria mb-3">
                  Detalhes
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
          </div>
        </div>
      </div>
    </div>
  );
}
