import { NextResponse } from "next/server";

interface QuoteItem {
  id: string;
  name: string;
  quantity?: number;
  weight?: number;
}

function simulateCorreiosPrice(weight: number, speedMultiplier: number) {
  const base = 12; // custo mínimo fictício
  const variable = weight * 15;
  return Number(((base + variable) * speedMultiplier).toFixed(2));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cep, items } = body as { cep?: string; items?: QuoteItem[] };

    if (!cep || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "CEP e itens são obrigatórios" },
        { status: 400 }
      );
    }

    const normalizedCep = cep.replace(/\D/g, "");
    if (normalizedCep.length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
    }

    const totalWeight = items.reduce((acc, item) => {
      const qty = item.quantity ?? 1;
      const weight = item.weight ?? 0.3; // 300g padrão
      return acc + weight * qty;
    }, 0);

    const options = [
      {
        id: `pac-${normalizedCep}`,
        label: "PAC Econômico",
        provider: "Correios PAC",
        etaDays: 7,
        price: simulateCorreiosPrice(totalWeight, 1),
      },
      {
        id: `sedex-${normalizedCep}`,
        label: "Sedex Rápido",
        provider: "Correios SEDEX",
        etaDays: 3,
        price: simulateCorreiosPrice(totalWeight, 1.45),
      },
      {
        id: `logistica-${normalizedCep}`,
        label: "Logística Express",
        provider: "Parceiro logístico",
        etaDays: 5,
        price: simulateCorreiosPrice(totalWeight, 1.2),
      },
    ];

    return NextResponse.json({ options });
  } catch (error) {
    console.error("[shipping/quote] erro ao gerar cotação", error);
    return NextResponse.json(
      { error: "Erro ao consultar frete" },
      { status: 500 }
    );
  }
}
