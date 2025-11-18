"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ProductDB } from "@/types/product";
import { Edit2, Trash2, Plus } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Carregando produtos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os produtos da sua loja
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center border-0 shadow-sm">
          <p className="text-gray-600 text-lg mb-4">
            Nenhum produto encontrado
          </p>
          <Link href="/admin/products/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Criar Primeiro Produto
            </Button>
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden border-0 shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Estoque
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    R$ {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.stock || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(product.id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Deletar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja deletar este produto? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteConfirm!)}
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
