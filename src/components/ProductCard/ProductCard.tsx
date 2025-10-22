import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({
  name,
  price,
  image,
  category,
}: ProductCardProps) {
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200">
      <div className="relative aspect-square overflow-hidden bg-[var(--color-geral)]">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-[var(--color-secondaria)] text-white text-xs font-semibold px-3 py-1 rounded-full">
          {category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-[var(--color-primaria)] mb-2 transition-all duration-300 group-hover:text-[var(--color-secondaria)]">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[var(--color-primaria)]">
            R$ {price.toFixed(2)}
          </span>

          <Button
            size="sm"
            className="bg-[var(--color-secondaria)] hover:bg-[var(--color-primaria)] text-white transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
