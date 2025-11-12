"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/types/product";

interface CategoriesNavProps {
  mobile?: boolean;
  onLinkClick?: () => void;
}

export default function CategoriesNav({
  mobile = false,
  onLinkClick,
}: CategoriesNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return null;
  }

  if (mobile) {
    return (
      <div className="flex flex-col gap-3">
        {categories.map((category, i) => (
          <Link
            key={`${category._id}-${i}`}
            href={`/products?category=${category.slug}`}
            onClick={onLinkClick}
            className="text-(--color-primaria) hover:text-(--color-secondaria) font-medium transition-all duration-300 py-2 px-3 rounded-lg hover:bg-(--color-secondaria)/10"
          >
            {category.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <ul className="flex items-center justify-start md:justify-center gap-4 sm:gap-6 lg:gap-8 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
      {categories.map((category, i) => (
        <li key={`${category._id}-${i}`} className="flex-shrink-0">
          <Link
            href={`/products?category=${category.slug}`}
            className="text-secondaria hover:text-white transition-all duration-300 text-xs sm:text-sm lg:text-base whitespace-nowrap font-bold"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
