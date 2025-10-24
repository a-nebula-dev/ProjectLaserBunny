import type { ProductDB, Product } from "@/types/Product";

export function transformProduct(
  product: ProductDB | ProductDB[]
): Product | Product[] {
  if (Array.isArray(product)) {
    return product.map((p) => ({
      ...p,
      id: p.id ? p.id.toString() : "",
    }));
  }

  return {
    ...product,
    id: product.id ? product.id.toString() : "",
  };
}
