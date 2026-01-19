import Link from "next/link";
import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SaleRecord } from "@/types/sale";

interface SuccessSearchParams {
  saleId?: string;
  paymentIntentId?: string;
}

async function fetchSale(
  saleId: string | undefined,
  baseUrl: string
): Promise<SaleRecord | null> {
  if (!saleId) return null;
  try {
    const url = baseUrl ? `${baseUrl}/api/orders/${saleId}` : `/api/orders/${saleId}`;
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.success) return null;
    return data.data as SaleRecord;
  } catch (err) {
    console.error("[checkout/success] fetch sale error", err);
    return null;
  }
}

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<SuccessSearchParams>;
}) {
  const { saleId, paymentIntentId } = await searchParams;
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const baseUrl = host ? `${protocol}://${host}` : "";
  const sale = await fetchSale(saleId, baseUrl);
  const paymentStatus = sale?.payment?.status;
  const badgeLabel =
    paymentStatus === "paid"
      ? "Pago"
      : paymentStatus === "failed"
        ? "Falhou"
        : "Processando";

  return (
    <div className="min-h-screen bg-geral">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primaria">
            Pedido confirmado
          </h1>
          <p className="text-primaria/70">
            Obrigado pela sua compra. Enviamos os detalhes do pedido para seu
            e-mail.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm text-primaria/60">Número do pedido</p>
              <p className="text-lg font-semibold text-primaria">
                {sale?.orderNumber || saleId || "Pedido"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge
                className={
                  paymentStatus === "paid"
                    ? "bg-green-600 text-white"
                    : paymentStatus === "failed"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-500 text-white"
                }
              >
                {badgeLabel}
              </Badge>
              {paymentIntentId && (
                <Badge variant="outline" className="text-primaria border-primaria/30">
                  PI: {paymentIntentId}
                </Badge>
              )}
            </div>
          </div>

          <Separator className="bg-primaria/10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-primaria">Entrega</h2>
              {sale ? (
                <div className="text-sm text-primaria/80 space-y-1">
                  <p>{sale.customer.fullName}</p>
                  <p>
                    {sale.customer.street}, {sale.customer.number}
                    {sale.customer.complement ? `, ${sale.customer.complement}` : ""}
                  </p>
                  <p>
                    {sale.customer.neighborhood} - {sale.customer.city}/
                    {sale.customer.state}
                  </p>
                  <p>CEP: {sale.customer.cep}</p>
                  <p>Telefone: {sale.customer.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-primaria/60">Carregando dados do pedido...</p>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-primaria">Pagamento</h2>
              <div className="text-sm text-primaria/80 space-y-1">
                <p>Método: {sale?.payment?.method || "Cartão"}</p>
                <p>Status: {paymentStatus || "confirmado"}</p>
                {paymentIntentId && <p>Payment Intent: {paymentIntentId}</p>}
              </div>
            </div>
          </div>

          <Separator className="bg-primaria/10" />

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-primaria">Itens</h2>
            <div className="space-y-2 text-sm text-primaria">
              {sale?.items?.map((item) => (
                <div
                  key={`${item.productId}-${item.name}`}
                  className="flex justify-between gap-3"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-primaria/60">Qtd: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    R$ {(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              )) || <p className="text-primaria/60">Nenhum item</p>}
            </div>
          </div>

          <Separator className="bg-primaria/10" />

          <div className="space-y-2 text-sm text-primaria">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {sale ? `R$ ${sale.totals.subtotal.toFixed(2)}` : "--"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span>{sale ? `R$ ${sale.totals.shipping.toFixed(2)}` : "--"}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{sale ? `R$ ${sale.totals.total.toFixed(2)}` : "--"}</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/products">
            <Card className="px-5 py-3 text-primaria border-primaria/20">
              Continuar comprando
            </Card>
          </Link>
          <Link href="/">
            <Card className="px-5 py-3 text-primaria border-primaria/20">
              Voltar para a página inicial
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
