"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import ImageKitMultiUpload from "@/components/ImageKitMultiUpload/ImageKitMultiUpload";
import type { Category, ProductDB } from "@/types/product";
import { ArrowLeft } from "lucide-react";

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const isEditing = productId && productId !== "new";

  const [loading, setLoading] = useState(!!isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    images: [] as string[],
    stock: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch("/api/categories");
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.data || []);
        }

        // Fetch product if editing
        if (isEditing) {
          const productRes = await fetch(`/api/products/${productId}`);
          if (productRes.ok) {
            const productData = await productRes.json();
            const product = productData.data;
            setFormData({
              name: product.name || "",
              price: product.price || "",
              category: product.category || "",
              description: product.description || "",
              image: product.image || "",
              images: product.images || [],
              stock: product.stock || "",
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditing, productId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: images,
      // Use primeira imagem como principal
      image: images[0] || prev.image,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = isEditing ? `/api/products/${productId}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          images: formData.images, // Enviar array de imagens
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const error = await res.json();
        console.error("Erro ao salvar:", error);
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? "Editar Produto" : "Novo Produto"}
        </h1>
      </div>

      <Card className="p-6 border-0 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Nome do Produto
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-gray-200"
                placeholder="Ex: Luminária Artesanal"
              />
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700 font-medium">
                Preço (R$)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="border-gray-200"
                placeholder="0.00"
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700 font-medium">
                Categoria
              </Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estoque */}
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-gray-700 font-medium">
                Estoque
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="border-gray-200"
                placeholder="0"
              />
            </div>
          </div>

          {/* Imagens - Multi Upload */}
          <ImageKitMultiUpload
            value={formData.images}
            onChange={handleImagesChange}
            maxImages={4}
          />

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Descrição
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              placeholder="Descrição detalhada do produto..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={submitting}
            >
              {submitting
                ? "Salvando..."
                : isEditing
                ? "Atualizar Produto"
                : "Criar Produto"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
