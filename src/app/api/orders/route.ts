import { NextRequest, NextResponse } from "next/server";
import { listSales } from "@/lib/sales";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("admin_auth");
    if (authCookie?.value !== "true") {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;

    const limitParsed = Number(searchParams.get("limit") || 20);
    const pageParsed = Number(searchParams.get("page") || 1);
    const limit = Number.isFinite(limitParsed) && limitParsed > 0 ? limitParsed : 20;
    const page = Number.isFinite(pageParsed) && pageParsed > 0 ? pageParsed : 1;
    const offset = (page - 1) * limit;

    const { data, total } = await listSales({
      paymentStatus: paymentStatus as any,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error("[orders] list error", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
