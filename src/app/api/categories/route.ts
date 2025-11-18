import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, createCategory } from "@/lib/db-operations";

// GET - Buscar todas as categorias
export async function GET() {
  try {
    const categories = await getAllCategories();

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

// POST - Adicionar nova categoria
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[DEBUG] POST /api/categories - Body recebido:", body);

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Nome da categoria é obrigatório" },
        { status: 400 }
      );
    }

    if (!body.slug) {
      return NextResponse.json(
        { success: false, error: "Slug é obrigatório" },
        { status: 400 }
      );
    }

    const newCategory = await createCategory({
      name: body.name,
      slug: body.slug,
      description: body.description || "",
    });

    console.log("[DEBUG] Categoria criada:", newCategory);

    return NextResponse.json(
      {
        success: true,
        message: "Categoria adicionada com sucesso",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ERROR] Erro ao adicionar categoria:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao adicionar categoria";
    return NextResponse.json(
      {
        success: false,
        error: message,
        details: error instanceof Error ? error.stack : "",
      },
      { status: 400 }
    );
  }
}
