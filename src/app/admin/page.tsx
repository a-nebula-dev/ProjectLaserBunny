import { connectToDatabase } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tags, DollarSign, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const client = await connectToDatabase();
  const db = client.db("laserBunny");

  // Get statistics
  const productsCount = await db.collection("products").countDocuments();
  const categoriesCount = await db.collection("categories").countDocuments();

  // Get total inventory value
  const products = await db.collection("products").find({}).toArray();
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * (product.stock || 0),
    0
  );

  // Get low stock products
  const lowStockCount = await db
    .collection("products")
    .countDocuments({ stock: { $lt: 10 } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-primaria)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-primaria)]/60">
          Welcome to your admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[var(--color-primaria)]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-primaria)]/60">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-[var(--color-secondaria)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-primaria)]">
              {productsCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-primaria)]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-primaria)]/60">
              Categories
            </CardTitle>
            <Tags className="h-4 w-4 text-[var(--color-secondaria)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-primaria)]">
              {categoriesCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-primaria)]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-primaria)]/60">
              Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[var(--color-secondaria)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-primaria)]">
              ${totalValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-primaria)]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-primaria)]/60">
              Low Stock Items
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-primaria)]">
              {lowStockCount}
            </div>
            {lowStockCount > 0 && (
              <p className="text-xs text-red-500 mt-1">
                Items with less than 10 in stock
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card className="border-[var(--color-primaria)]/20">
        <CardHeader>
          <CardTitle className="text-[var(--color-primaria)]">
            Recent Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div
                key={product._id.toString()}
                className="flex items-center justify-between border-b border-[var(--color-primaria)]/10 pb-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-[var(--color-primaria)]">
                      {product.name}
                    </p>
                    <p className="text-sm text-[var(--color-primaria)]/60">
                      {product.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--color-secondaria)]">
                    ${product.price}
                  </p>
                  <p className="text-sm text-[var(--color-primaria)]/60">
                    Stock: {product.stock || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
