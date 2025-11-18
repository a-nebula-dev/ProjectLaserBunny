import { NextRequest, NextResponse } from "next/server";
import { getAllSections, createSection } from "@/lib/db-operations";

// GET - Buscar todas as seções
export async function GET() {
  try {
    const sections = await getAllSections();

    return NextResponse.json({
      success: true,
      data: sections,
      count: sections.length,
    });
  } catch (error) {
    console.error("Erro ao buscar seções:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar seções" },
      { status: 500 }
    );
  }
}

// POST - Adicionar nova seção
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newSection = await createSection({
      title: body.title,
      slug: body.slug,
      description: body.description || "",
      image: body.image || "",
      order: body.order || 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Seção adicionada com sucesso",
        data: newSection,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao adicionar seção:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao adicionar seção";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
