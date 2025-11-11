"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import type { Section } from "@/types/product";
import { Edit2, Trash2, Plus } from "lucide-react";

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/sections");
      const data = await res.json();
      if (data.success) {
        setSections(data.data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar seções:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sections/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSections(sections.filter((s) => s._id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Erro ao deletar seção:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Carregando seções...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seções</h1>
          <p className="text-gray-600 mt-1">Gerencie as seções da sua loja</p>
        </div>
        <Link href="/admin/sections/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Seção
          </Button>
        </Link>
      </div>

      {sections.length === 0 ? (
        <Card className="p-12 text-center border-0 shadow-sm">
          <p className="text-gray-600 text-lg mb-4">Nenhuma seção encontrada</p>
          <Link href="/admin/sections/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Criar Primeira Seção
            </Button>
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden border-0 shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Ordem
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Descrição
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sections.map((section) => (
                <tr
                  key={section._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {section.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{section.slug}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {section.order || 0}
                  </td>
                  <td className="px-6 py-4 text-gray-600 truncate">
                    {section.description || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/sections/${section._id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(section._id || "")}
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
            <AlertDialogTitle>Deletar Seção</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja deletar esta seção? Esta ação não pode
              ser desfeita.
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
