import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Category from "@/lib/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 }).lean();

    // Transform _id to id for frontend compatibility
    const transformedCategories = categories.map((category) => ({
      ...category,
      id: category._id.toString(),
      _id: category._id.toString(),
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error("[v0] Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
