"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import type { ProductDB, Category } from "@/types/product";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState("all");
  const [products, setProducts] = useState<ProductDB[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 1000]);
    setSelectedRating("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-geral flex items-center justify-center">
        <div className="text-primaria text-lg">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-geral">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primaria mb-2">
            Nossos Produtos
          </h1>
          <p className="text-primaria/70 text-base sm:text-lg">
            Explore nossa coleção completa de produtos artesanais
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-primaria text-white hover:bg-primaria/90"
            >
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>
          </div>

          {/* Filters Sidebar */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0 bg-white rounded-lg border border-primaria/20 p-6 h-fit lg:sticky lg:top-4`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primaria">Filtros</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-primaria/60 hover:text-primaria hover:bg-primaria/5"
              >
                Limpar
              </Button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primaria mb-3">
                Categoria
              </h3>
              <RadioGroup
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="all" id="cat-all" />
                  <Label
                    htmlFor="cat-all"
                    className="text-sm text-primaria/80 cursor-pointer"
                  >
                    Todas
                  </Label>
                </div>
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <RadioGroupItem
                      value={category.name}
                      id={`cat-${category._id}`}
                    />
                    <Label
                      htmlFor={`cat-${category._id}`}
                      className="text-sm text-primaria/80 cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator className="my-6 bg-primaria/10" />

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primaria mb-3">
                Faixa de Preço
              </h3>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-4"
              />
              <div className="flex items-center justify-between text-sm text-primaria/70">
                <span>R$ {priceRange[0]}</span>
                <span>R$ {priceRange[1]}</span>
              </div>
            </div>

            <Separator className="my-6 bg-primaria/10" />

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primaria mb-3">
                Avaliação
              </h3>
              <RadioGroup
                value={selectedRating}
                onValueChange={setSelectedRating}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="all" id="rating-all" />
                  <Label
                    htmlFor="rating-all"
                    className="text-sm text-primaria/80 cursor-pointer"
                  >
                    Todas
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="5" id="rating-5" />
                  <Label
                    htmlFor="rating-5"
                    className="text-sm text-primaria/80 cursor-pointer"
                  >
                    ⭐⭐⭐⭐⭐ (5 estrelas)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="4" id="rating-4" />
                  <Label
                    htmlFor="rating-4"
                    className="text-sm text-primaria/80 cursor-pointer"
                  >
                    ⭐⭐⭐⭐ (4+)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="3" id="rating-3" />
                  <Label
                    htmlFor="rating-3"
                    className="text-sm text-primaria/80 cursor-pointer"
                  >
                    ⭐⭐⭐ (3+)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator className="my-6 bg-primaria/10" />

            {/* Availability Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primaria mb-3">
                Disponibilidade
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox id="in-stock" />
                <Label
                  htmlFor="in-stock"
                  className="text-sm text-primaria/80 cursor-pointer"
                >
                  Em estoque
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="on-sale" />
                <Label
                  htmlFor="on-sale"
                  className="text-sm text-primaria/80 cursor-pointer"
                >
                  Em promoção
                </Label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-primaria/60">
                {filteredProducts.length} produto(s) encontrado(s)
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-primaria/20">
                <p className="text-primaria/70 text-lg mb-4">
                  Nenhum produto encontrado
                </p>
                <Button
                  variant="outline"
                  className="border-primaria text-primaria hover:bg-primaria hover:text-white bg-transparent"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
