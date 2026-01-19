"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { SaleRecord } from "@/types/sale";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = params?.id;

  const [order, setOrder] = useState<SaleRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string>("pending");
  const [trackingCode, setTrackingCode] = useState<string>("");

  useEffect(() => {
    if (orderId) fetchOrder(orderId);
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
        setFulfillmentStatus(data.data.fulfillment?.status || "pending");
        setTrackingCode(data.data.fulfillment?.trackingCode || "");
      } else {
        toast.error(data.error || "Erro ao carregar pedido");
      }
    } catch (error) {
      console.error("Erro ao carregar pedido", error);
      toast.error("Erro ao carregar pedido");
    } finally {
      setLoading(false);
    }
  };

  const saveFulfillment = async () => {
    if (!orderId) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: fulfillmentStatus, trackingCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha ao salvar");
      }
      setOrder(data.data);
      toast.success("Fulfillment atualizado");
    } catch (error) {
      console.error("Erro ao salvar", error);
      toast.error(error instanceof Error ? error.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (!orderId) {
    return <div>Pedido inválido.</div>;
  }

  if (loading) {
    return <div className="py-10 text-center">Carregando pedido...</div>;
  }

  if (!order) {
    return (
      <div className="py-10 text-center space-y-3">
        <p>Pedido não encontrado.</p>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedido {order.orderNumber}</h1>
          <p className="text-gray-600">{order._id}</p>
        </div>
        <Link href="/admin/orders">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 space-y-3 lg:col-span-2">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className="bg-blue-600 text-white">{order.payment.status}</Badge>
            <Badge variant="secondary">{order.fulfillment.status}</Badge>
          </div>

          <Separator className="bg-gray-100" />

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Itens</h2>
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.name}`} className="flex justify-between text-sm text-gray-800">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">Qtd: {item.quantity}</p>
                </div>
                <p className="font-semibold">R$ {(item.unitPrice * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <Separator className="bg-gray-100" />

          <div className="space-y-2 text-sm text-gray-800">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {order.totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span>R$ {order.totals.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>R$ {order.totals.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-900">Entrega</h2>
            <p className="text-sm text-gray-700">{order.customer.fullName}</p>
            <p className="text-sm text-gray-700">
              {order.customer.street}, {order.customer.number}
              {order.customer.complement ? `, ${order.customer.complement}` : ""}
            </p>
            <p className="text-sm text-gray-700">
              {order.customer.neighborhood} - {order.customer.city}/{order.customer.state}
            </p>
            <p className="text-sm text-gray-600">CEP: {order.customer.cep}</p>
            <p className="text-sm text-gray-600">Telefone: {order.customer.phone}</p>
          </div>

          <Separator className="bg-gray-100" />

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Fulfillment</h2>
            <Select value={fulfillmentStatus} onValueChange={setFulfillmentStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="packing">Separando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-1">
              <p className="text-sm text-gray-700">Código de rastreio</p>
              <Input
                placeholder="Ex: BR123456789XX"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />
            </div>

            <Button onClick={saveFulfillment} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>

          <Separator className="bg-gray-100" />

          <div className="space-y-1 text-sm text-gray-700">
            <p>Método de pagamento: {order.payment.method}</p>
            <p>Status: {order.payment.status}</p>
            {order.payment.history?.length ? (
              <div className="mt-2 space-y-1">
                <p className="font-medium text-gray-800">Histórico</p>
                {order.payment.history.map((h, idx) => (
                  <p key={idx} className="text-gray-600">
                    {h.status} em {new Date(h.timestamp).toLocaleString("pt-BR")}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
