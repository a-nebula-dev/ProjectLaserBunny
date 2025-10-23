import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/lib/models/product";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Transform _id to id for frontend compatibility
    const transformedProduct = {
      ...product,
      id: product.id.toString(),
      _id: product.id.toString(),
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("[v0] Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
