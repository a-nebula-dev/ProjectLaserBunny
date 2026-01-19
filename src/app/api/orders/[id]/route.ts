import { NextRequest, NextResponse } from "next/server";
import { getSaleById, updateSaleFulfillment } from "@/lib/sales";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCookie = request.cookies.get("admin_auth");
    if (authCookie?.value !== "true") {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const sale = await getSaleById(id);

    if (!sale) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: sale });
  } catch (error) {
    console.error("[orders/[id]] error", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCookie = request.cookies.get("admin_auth");
    if (authCookie?.value !== "true") {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await updateSaleFulfillment(id, {
      status: body?.status,
      trackingCode: body?.trackingCode,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[orders/[id]] patch error", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
