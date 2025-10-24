import type { ProductDB, Product } from "@/types/Product";

export function transformProduct(
  product: ProductDB | ProductDB[]
): Product | Product[] {
  if (Array.isArray(product)) {
    return product.map((p) => ({
      ...p,
      id: p._id ? p._id.toString() : "",
    }));
  }

  return {
    ...product,
    id: product._id ? product._id.toString() : "",
  };
}
