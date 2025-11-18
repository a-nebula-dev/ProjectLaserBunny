"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function SectionFormPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params?.id as string;
  const isEditing = sectionId && sectionId !== "new";

  const [loading, setLoading] = useState(!!isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
    order: "",
  });

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    const fetchSection = async () => {
      try {
        const res = await fetch(`/api/sections/${sectionId}`);
        if (res.ok) {
          const data = await res.json();
          const section = data.data;
          setFormData({
            title: section.title || "",
            slug: section.slug || "",
            description: section.description || "",
            image: section.image || "",
            order: section.order || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar seção:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [isEditing, sectionId]);

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
    const slug = formData.title
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

    try {
      const url = isEditing ? `/api/sections/${sectionId}` : "/api/sections";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order) || 0,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Seção salva com sucesso!");
        setTimeout(() => router.push("/admin/sections"), 1000);
      } else {
        toast.error(data.error || "Erro ao salvar seção");
        console.error("Erro ao salvar:", data);
      }
    } catch (error) {
      toast.error("Erro ao salvar seção");
      console.error("Erro ao salvar seção:", error);
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
          {isEditing ? "Editar Seção" : "Nova Seção"}
        </h1>
      </div>

      <Card className="p-6 border-0 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Título da Seção
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="border-gray-200"
                placeholder="Ex: Nossos Produtos"
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
                  placeholder="nossos-produtos"
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Auto-gerar
                </Button>
              </div>
            </div>

            {/* Ordem */}
            <div className="space-y-2">
              <Label htmlFor="order" className="text-gray-700 font-medium">
                Ordem
              </Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                className="border-gray-200"
                placeholder="0"
              />
            </div>

            {/* Imagem */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-700 font-medium">
                URL da Imagem
              </Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="border-gray-200"
                placeholder="https://..."
              />
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
              placeholder="Descrição da seção..."
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
                ? "Atualizar Seção"
                : "Criar Seção"}
            </Button>
          </div>
        </form>
      </Card>
      <Toaster />
    </div>
  );
}
