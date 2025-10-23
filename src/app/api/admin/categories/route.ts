import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// GET all categories
export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("laserBunny");
    const categories = await db
      .collection("categories")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[v0] Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("laserBunny");

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    // Check if category already exists
    const existing = await db.collection("categories").findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const category = {
      name,
      slug,
      description: description || "",
      createdAt: new Date(),
    };

    const result = await db.collection("categories").insertOne(category);

    return NextResponse.json(
      { ...category, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
