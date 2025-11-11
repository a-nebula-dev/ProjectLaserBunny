import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/db-operations";

// GET - Buscar todos os produtos
export async function GET(request: NextRequest) {
  try {
    const products = await getAllProducts();

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

// POST - Adicionar novo produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newProduct = await createProduct({
      name: body.name,
      price: body.price,
      description: body.description || "",
      category: body.category || "",
      image: body.image || body.images?.[0] || "",
      images: body.images || [],
      stock: body.stock || 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Produto adicionado com sucesso",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao adicionar produto";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
