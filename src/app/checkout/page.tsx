"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AddressForm {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface ShippingOption {
  id: string;
  label: string;
  provider: string;
  etaDays: number;
  price: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    email: "",
    phone: "",
    document: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>("");
  const [shippingLoading, setShippingLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "other">(
    "card"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartIsEmpty = items.length === 0;

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculateShipping = async () => {
    if (!address.cep || address.cep.replace(/\D/g, "").length !== 8) {
      toast.error("Informe um CEP válido para calcular o frete");
      return;
    }

    if (cartIsEmpty) {
      toast.error("Adicione itens ao carrinho antes de calcular o frete");
      return;
    }

    setShippingLoading(true);
    try {
      const response = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: address.cep,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            weight: item.weight ?? 0.3,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível calcular o frete");
      }

      const data = await response.json();
      setShippingOptions(data.options || []);

      if ((data.options || []).length === 0) {
        toast.warning("Nenhum serviço disponível para o CEP informado");
      } else {
        toast.success("Frete atualizado com sucesso");
      }
    } catch (error) {
      console.error("Erro ao calcular frete", error);
      toast.error("Erro ao consultar os Correios. Tente novamente.");
    } finally {
      setShippingLoading(false);
    }
  };

  const selectedShipping = shippingOptions.find(
    (option) => option.id === selectedShippingId
  );

  const orderSubtotal = getTotalPrice();
  const orderShipping = selectedShipping?.price ?? 0;
  const orderTotal = orderSubtotal + orderShipping;

  const handleSubmitOrder = async () => {
    if (cartIsEmpty) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    if (!selectedShipping) {
      toast.error("Selecione um serviço de entrega");
      return;
    }

    if (
      !address.fullName ||
      !address.email ||
      !address.cep ||
      !address.street
    ) {
      toast.error("Preencha os dados de endereço");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        address,
        shipping: selectedShipping,
        paymentMethod,
        items,
      };

      const response = await fetch("/api/checkout/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar pedido");
      }

      const data = await response.json();

      if (paymentMethod === "card" && data.clientSecret) {
        toast.success(
          "Intenção de pagamento criada. Em breve integraremos o Stripe."
        );
      } else if (paymentMethod === "pix" && data.pix) {
        toast.success("Cobrança Pix preparada. Em breve exibiremos o QR Code.");
      } else {
        toast.success("Pedido registrado. Processamento em andamento.");
      }
    } catch (error) {
      console.error("Erro ao enviar pedido", error);
      toast.error("Erro ao processar seu checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartIsEmpty) {
    return (
      <div className="min-h-screen bg-geral flex flex-col items-center justify-center px-4 text-center gap-6">
        <h1 className="text-3xl font-bold text-primaria">
          Seu carrinho está vazio
        </h1>
        <p className="text-primaria/70 max-w-md">
          Adicione produtos antes de continuar para o checkout. Seus dados serão
          solicitados novamente quando houver itens disponíveis.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/products">
            <Button className="bg-secondaria text-primaria hover:bg-secondaria/90">
              Ver produtos
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" className="text-primaria border-primaria">
              Voltar ao carrinho
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-geral">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-primaria/60">Passo 2 de 3</p>
            <h1 className="text-3xl font-bold text-primaria">Checkout</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="text-primaria border-primaria"
              onClick={() => router.push("/cart")}
            >
              Editar carrinho
            </Button>
            <Button
              variant="ghost"
              className="text-primaria/70"
              onClick={clearCart}
            >
              Limpar tudo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-4">
              <div>
                <p className="text-sm text-primaria/60">Etapa 1</p>
                <h2 className="text-xl font-semibold text-primaria">
                  Dados pessoais e endereço
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    value={address.fullName}
                    onChange={(e) =>
                      handleAddressChange("fullName", e.target.value)
                    }
                    placeholder="Nome e sobrenome"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={address.email}
                    onChange={(e) =>
                      handleAddressChange("email", e.target.value)
                    }
                    placeholder="seuemail@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone/WhatsApp</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) =>
                      handleAddressChange("phone", e.target.value)
                    }
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="document">CPF/CNPJ</Label>
                  <Input
                    id="document"
                    value={address.document}
                    onChange={(e) =>
                      handleAddressChange("document", e.target.value)
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <Separator className="bg-primaria/10" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={address.cep}
                    onChange={(e) => handleAddressChange("cep", e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    placeholder="Av. Paulista"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={address.number}
                    onChange={(e) =>
                      handleAddressChange("number", e.target.value)
                    }
                    placeholder="123"
                  />
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={address.complement}
                    onChange={(e) =>
                      handleAddressChange("complement", e.target.value)
                    }
                    placeholder="Apartamento, bloco..."
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={address.neighborhood}
                    onChange={(e) =>
                      handleAddressChange("neighborhood", e.target.value)
                    }
                    placeholder="Bairro"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    maxLength={2}
                    value={address.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value.toUpperCase())
                    }
                    placeholder="SP"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações para entrega</Label>
                <Textarea
                  id="notes"
                  value={address.complement}
                  onChange={(e) =>
                    handleAddressChange("complement", e.target.value)
                  }
                  placeholder="Portaria 24h, deixar com o porteiro..."
                />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primaria/60">Etapa 2</p>
                  <h2 className="text-xl font-semibold text-primaria">
                    Frete e Correios
                  </h2>
                </div>
                <Button
                  onClick={handleCalculateShipping}
                  disabled={shippingLoading}
                >
                  {shippingLoading ? "Consultando..." : "Calcular frete"}
                </Button>
              </div>
              <p className="text-sm text-primaria/70">
                Usaremos a API dos Correios para obter os prazos e valores e
                você poderá escolher a melhor opção.
              </p>

              {shippingOptions.length === 0 && (
                <div className="rounded-md border border-dashed border-primaria/20 p-4 text-center text-sm text-primaria/70">
                  Informe seu CEP e calcule para ver as opções disponíveis.
                </div>
              )}

              {shippingOptions.length > 0 && (
                <RadioGroup
                  className="grid gap-3"
                  value={selectedShippingId}
                  onValueChange={setSelectedShippingId}
                >
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-md border p-4 cursor-pointer transition-all ${
                        selectedShippingId === option.id
                          ? "border-secondaria bg-secondaria/5"
                          : "border-primaria/10 hover:border-secondaria/50"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-primaria">
                          {option.label}
                        </p>
                        <p className="text-sm text-primaria/60">
                          Estimativa de {option.etaDays} dias úteis via{" "}
                          {option.provider}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-secondaria">
                          R$ {option.price.toFixed(2)}
                        </Badge>
                        <RadioGroupItem value={option.id} className="h-5 w-5" />
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              )}
            </Card>

            <Card className="p-6 space-y-4">
              <div>
                <p className="text-sm text-primaria/60">Etapa 3</p>
                <h2 className="text-xl font-semibold text-primaria">
                  Pagamento
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                >
                  Cartões (Stripe)
                </Button>
                <Button
                  variant={paymentMethod === "pix" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("pix")}
                >
                  Pix
                </Button>
                <Button
                  variant={paymentMethod === "other" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("other")}
                >
                  Outros
                </Button>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <p className="text-sm text-primaria/70">
                    Aceitamos todas as principais bandeiras via Stripe. Seus
                    dados são processados em ambiente seguro.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="card-holder">
                        Nome impresso no cartão
                      </Label>
                      <Input
                        id="card-holder"
                        placeholder="Nome exatamente como aparece"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-document">CPF do titular</Label>
                      <Input id="card-document" placeholder="000.000.000-00" />
                    </div>
                  </div>
                  <div className="rounded-md border border-dashed border-primaria/20 p-4 text-sm text-primaria/70">
                    Em breve exibiremos o Stripe Payment Element aqui.
                  </div>
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="space-y-3">
                  <p className="text-sm text-primaria/70">
                    Você receberá um QR Code Pix válido por 15 minutos. Após o
                    pagamento confirmaremos automaticamente.
                  </p>
                  <div className="rounded-md border border-dashed border-secondaria/40 p-4 text-center text-primaria/80">
                    Área reservada para o QR Code Pix e instruções de copia e
                    cola.
                  </div>
                </div>
              )}

              {paymentMethod === "other" && (
                <div className="space-y-3 text-sm text-primaria/70">
                  <p>
                    Nesta aba adicionaremos Google Pay e futuras integrações.
                  </p>
                  <p>
                    No momento, utilize cartões ou Pix. Assim que liberarmos
                    novos métodos eles aparecerão automaticamente aqui.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div>
                <p className="text-sm text-primaria/60">Resumo</p>
                <h2 className="text-xl font-semibold text-primaria">
                  Seu pedido
                </h2>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-primaria">{item.name}</p>
                      <p className="text-sm text-primaria/60">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-primaria">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="bg-primaria/10" />
              <div className="space-y-2 text-sm text-primaria">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {orderSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>
                    {selectedShipping
                      ? `R$ ${selectedShipping.price.toFixed(2)}`
                      : "Calcular"}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>R$ {orderTotal.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
                disabled={isSubmitting}
                onClick={handleSubmitOrder}
              >
                {isSubmitting ? "Processando..." : "Finalizar pedido"}
              </Button>
              <p className="text-xs text-primaria/60 text-center">
                Ao continuar você concorda com nossos termos e políticas de
                envio.
              </p>
            </Card>

            <Card className="p-6 space-y-3 text-sm text-primaria/70">
              <h3 className="text-base font-semibold text-primaria">
                Precisa de ajuda?
              </h3>
              <p>
                Fale conosco no WhatsApp ou Instagram para ajustar seu pedido
                antes de pagar. Estamos online em horário comercial.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
