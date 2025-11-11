"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("[DEBUG] Enviando requisição de login com senha:", password);

      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include", // Importante para enviar/receber cookies
      });

      const data = await res.json();
      console.log("[DEBUG] Resposta do servidor:", {
        status: res.status,
        ...data,
      });

      if (res.ok) {
        console.log("[DEBUG] Login bem-sucedido, redirecionando...");
        // Aguarda um pouco para o cookie ser definido
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push("/admin");
        router.refresh(); // Força refresh para aplicar o novo middleware
      } else {
        console.log("[DEBUG] Erro de autenticação:", data);
        setError(data.error || "Senha incorreta");
      }
    } catch (err) {
      console.error("[ERROR] Erro ao fazer requisição:", err);
      setError("Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Painel Administrativo
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Digite a senha para acessar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha..."
              className="border-gray-300"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <Link href="/">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voltar para home
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
