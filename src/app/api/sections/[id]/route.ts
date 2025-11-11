import { NextRequest, NextResponse } from "next/server";
import {
  getSectionById,
  updateSection,
  deleteSection,
} from "@/lib/db-operations";

// GET - Buscar seção por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const section = await getSectionById(id);

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Seção não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("Erro ao buscar seção:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao buscar seção";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

// PUT - Atualizar seção
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedSection = await updateSection(id, body);

    if (!updatedSection) {
      return NextResponse.json(
        { success: false, error: "Seção não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seção atualizada com sucesso",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Erro ao atualizar seção:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao atualizar seção";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

// DELETE - Remover seção
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteSection(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Seção não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seção removida com sucesso",
      deletedId: id,
    });
  } catch (error) {
    console.error("Erro ao remover seção:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao remover seção";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
