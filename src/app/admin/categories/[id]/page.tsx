"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { Category } from "@/types/product";
import { ArrowLeft } from "lucide-react";

export default function CategoryFormPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;
  const isEditing = categoryId && categoryId !== "new";

  const [loading, setLoading] = useState(!!isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [isEditing, categoryId]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/categories/${categoryId}`);
      if (res.ok) {
        const data = await res.json();
        const category = data.data;
        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar categoria:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    console.log("[DEBUG] Enviando categoria:", formData);

    try {
      const url = isEditing
        ? `/api/categories/${categoryId}`
        : "/api/categories";
      const method = isEditing ? "PUT" : "POST";

      console.log("[DEBUG] URL:", url, "Método:", method);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("[DEBUG] Status:", res.status);

      const data = await res.json();
      console.log("[DEBUG] Resposta:", data);

      if (res.ok) {
        console.log("[DEBUG] Sucesso, redirecionando...");
        router.push("/admin/categories");
      } else {
        console.error("[ERROR] Erro na resposta:", data);
      }
    } catch (error) {
      console.error("[ERROR] Erro ao salvar categoria:", error);
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
          {isEditing ? "Editar Categoria" : "Nova Categoria"}
        </h1>
      </div>

      <Card className="p-6 border-0 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Nome da Categoria
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border-gray-200"
              placeholder="Ex: Iluminação"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-gray-700 font-medium">
              Slug
            </Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="border-gray-200 flex-1"
                placeholder="iluminacao"
              />
              <Button type="button" variant="outline" onClick={generateSlug}>
                Auto-gerar
              </Button>
            </div>
          </div>

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
              placeholder="Descrição da categoria..."
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
                ? "Atualizar Categoria"
                : "Criar Categoria"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
