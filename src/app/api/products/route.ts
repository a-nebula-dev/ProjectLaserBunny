import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/lib/models/product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    // Transform _id to id for frontend compatibility
    const transformedProducts = products.map((product) => ({
      ...product,
      id: product.id.toString(),
      _id: product.id.toString(),
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("[v0] Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
