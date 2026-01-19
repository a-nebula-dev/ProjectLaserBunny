"use client";

import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-geral flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="w-24 h-24 mx-auto text-primaria/40 mb-6" />
          <h1 className="text-3xl font-bold text-primaria mb-4">
            Seu carrinho está vazio
          </h1>
          <p className="text-primaria/70 mb-8">
            Adicione produtos ao carrinho para continuar comprando
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="bg-secondaria text-primaria hover:bg-secondaria/90 font-semibold"
            >
              Ver Produtos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-geral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primaria mb-2">
            Carrinho de Compras
          </h1>
          <p className="text-primaria/70">
            {items.length} {items.length === 1 ? "item" : "itens"} no carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="p-4 sm:p-6 bg-white border-primaria/10 shadow-sm"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-geral flex-shrink-0 shadow-sm">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <Link
                          href={`/products/${item.id}`}
                          className="hover:underline"
                        >
                          <h3 className="text-lg font-semibold text-primaria truncate">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-primaria/60">
                          {item.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-primaria/30 text-primaria hover:bg-primaria hover:text-white bg-transparent"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-base font-medium w-12 text-center text-primaria">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-primaria/30 text-primaria hover:bg-primaria hover:text-white bg-transparent"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-secondaria">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-primaria/60">
                          R$ {item.price.toFixed(2)} cada
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
              onClick={clearCart}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Carrinho
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4 bg-white border-primaria/10 shadow-md">
              <h2 className="text-xl font-bold text-primaria mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-primaria/70">Subtotal</span>
                  <span className="font-medium text-primaria">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-primaria/70">Frete</span>
                  <span className="font-medium text-primaria">A calcular</span>
                </div>

                <Separator className="bg-primaria/20" />

                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-primaria">Total</span>
                  <span className="font-bold text-secondaria text-2xl">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <Button
                  size="lg"
                  className="w-full mb-3 bg-secondaria text-primaria hover:bg-secondaria/90 font-semibold"
                >
                  Finalizar Compra
                </Button>
              </Link>

              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-primaria text-primaria hover:bg-primaria hover:text-white bg-transparent"
                >
                  Continuar Comprando
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
