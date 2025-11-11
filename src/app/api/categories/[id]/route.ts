import { NextRequest, NextResponse } from "next/server";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/lib/db-operations";

// GET - Buscar categoria por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const category = await getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao buscar categoria";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

// PUT - Atualizar categoria
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updatedCategory = await updateCategory(id, body);

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Categoria atualizada com sucesso",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao atualizar categoria";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

// DELETE - Remover categoria
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = await deleteCategory(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Categoria removida com sucesso",
      deletedId: id,
    });
  } catch (error) {
    console.error("Erro ao remover categoria:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao remover categoria";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
