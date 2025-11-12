"use client";

import { Image } from "@imagekit/next";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import {
  ShoppingCart,
  CreditCard,
  Smartphone,
  Receipt,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer/Footer";
import ProductCard from "@/components/ProductCard/ProductCard";
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<ProductDB[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          const fetchedProduct = data.data;
          setProduct(fetchedProduct);

          // Fetch similar products (same category)
          try {
            const allProductsResponse = await fetch("/api/products");
            if (allProductsResponse.ok) {
              const allProductsData = await allProductsResponse.json();
              const products = allProductsData.data || [];

              // Filter products from same category, exclude current product, limit to 4
              const similar = products
                .filter(
                  (p: ProductDB) =>
                    p.category === fetchedProduct.category &&
                    ((p as any).id || (p as any)._id) !== productId
                )
                .slice(0, 4);

              setSimilarProducts(similar);
            }
          } catch (err) {
            console.error(
              "[Product Detail] Error fetching similar products:",
              err
            );
          }
        } else {
          toast.error("Produto não encontrado");
          router.push("/products");
        }
      } catch (error) {
        console.error("[Product Detail] Error fetching product:", error);
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

  // Use product.images if available, fallback to product.image
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  // Validate selected image index
  const currentImageIndex = Math.min(
    selectedImageIndex,
    productImages.length - 1
  );
  const currentImage =
    productImages[currentImageIndex] || product.image || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-geral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to list button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-primaria hover:text-secondaria font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

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
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-secondaria shadow-md scale-105"
                      : "border-primaria/20 hover:border-primaria/40"
                  }`}
                >
                  <Image
                    urlEndpoint="https://ik.imagekit.io/NebulaDev"
                    src={img}
                    alt={`${product.name} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg border border-primaria/10">
                <Image
                  urlEndpoint="https://ik.imagekit.io/NebulaDev"
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
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
            </div>

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

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-primaria/10">
            <h2 className="text-2xl sm:text-3xl font-bold text-primaria mb-8">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similarProducts.map((p) => (
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
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
