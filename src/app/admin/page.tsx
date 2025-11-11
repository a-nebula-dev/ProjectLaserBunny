"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSections: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalSections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, sectionsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/sections"),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const sectionsData = await sectionsRes.json();

        setStats({
          totalProducts: productsData.count || 0,
          totalCategories: categoriesData.count || 0,
          totalSections: sectionsData.count || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao painel de administração
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total de Produtos */}
        <Card className="p-6 border-0 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total de Produtos
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalProducts}
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </Card>

        {/* Total de Categorias */}
        <Card className="p-6 border-0 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total de Categorias
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalCategories}
              </p>
            </div>
            <div className="text-4xl">🏷️</div>
          </div>
        </Card>

        {/* Total de Seções */}
        <Card className="p-6 border-0 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total de Seções
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalSections}
              </p>
            </div>
            <div className="text-4xl">📑</div>
          </div>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="p-6 border-0 shadow-sm bg-blue-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Atalhos Rápidos
        </h2>
        <p className="text-gray-600 text-sm">
          Use o menu lateral para navegar entre produtos, categorias e seções.
          Você pode adicionar, editar ou remover itens conforme necessário.
        </p>
      </Card>
    </div>
  );
}
