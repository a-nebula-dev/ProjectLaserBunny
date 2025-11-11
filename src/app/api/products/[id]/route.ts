import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/db-operations";

// GET - Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao buscar produto";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

// PUT - Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Log incoming data for debugging when clients receive unexpected responses
    console.log("[api/products/[id] PUT] id:", id);
    console.log("[api/products/[id] PUT] body:", body);

    // Normalize update data: use first image as main if images provided
    const updateData = {
      ...body,
      image: body.image || body.images?.[0] || "",
    };

    const updatedProduct = await updateProduct(id, updateData);

    console.log("[api/products/[id] PUT] updatedProduct:", updatedProduct);

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produto atualizado com sucesso",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao atualizar produto";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

// DELETE - Remover produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produto removido com sucesso",
      deletedId: id,
    });
  } catch (error) {
    console.error("Erro ao remover produto:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao remover produto";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
