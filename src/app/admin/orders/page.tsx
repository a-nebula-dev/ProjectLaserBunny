"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { SaleRecord, PaymentStatus } from "@/types/sale";

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "all">("all");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0 });

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatus, pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      if (paymentStatus !== "all") params.set("paymentStatus", paymentStatus);

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
        setPagination((prev) => ({ ...prev, total: data.pagination?.total || 0 }));
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pagination.limit));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-1">Acompanhe pagamentos e fulfillment</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus | "all")}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendente</option>
            <option value="waiting_confirmation">Aguardando</option>
            <option value="paid">Pago</option>
            <option value="failed">Falhou</option>
            <option value="refunded">Estornado</option>
            <option value="expired">Expirado</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Carregando pedidos...</div>
      ) : orders.length === 0 ? (
        <Card className="p-10 text-center">Nenhum pedido encontrado.</Card>
      ) : (
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order._id} className="p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex flex-wrap justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">{order.orderNumber || order._id}</p>
                    <p className="text-base font-semibold text-gray-900">
                      {order.customer.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.customer.city} / {order.customer.state}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="outline" className="text-gray-800 border-gray-300">
                      R$ {order.totals.total.toFixed(2)}
                    </Badge>
                    <Badge className="bg-blue-600 text-white">
                      {order.payment.status}
                    </Badge>
                    <Badge variant="secondary" className="text-gray-800">
                      {order.fulfillment.status}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    <p>
                      Criado em {new Date(order.createdAt).toLocaleString("pt-BR")}
                    </p>
                    <p className="text-gray-500">{order.items.length} item(s)</p>
                  </div>
                  <Link href={`/admin/orders/${order._id}`}>
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {pagination.page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= totalPages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
