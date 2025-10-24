import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/lib/models/Product";

// GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    // Transform _id to string for frontend
    const transformedProducts = products.map((product) => ({
      ...product,
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

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, image, category, description, stock, details } = body;

    if (!name || !price || !image || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      name,
      price: Number.parseFloat(price),
      image,
      category,
      description: description || "",
      stock: Number.parseInt(stock) || 0,
      details: details || [],
    });

    return NextResponse.json(
      { ...product.toObject(), _id: product._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
