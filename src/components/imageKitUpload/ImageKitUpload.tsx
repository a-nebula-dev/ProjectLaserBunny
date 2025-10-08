"use client";
import { useState } from "react";
import { Button } from "../ui/button"; // shadcn/ui
import { Input } from "../ui/input"; // shadcn/ui
import Image from "next/image";

export default function ImageKitUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setUrl(data.url);
    } else {
      setError(data.error || "Erro ao enviar imagem.");
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleUpload}
      className="flex flex-col gap-4 max-w-sm mx-auto mt-8 p-6 border rounded-lg shadow bg-white dark:bg-zinc-900"
    >
      <label className="font-semibold">Selecione uma imagem para enviar:</label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button type="submit" disabled={!file || loading}>
        {loading ? "Enviando..." : "Enviar"}
      </Button>
      {error && <span className="text-red-500">{error}</span>}
      {url && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <span className="text-green-600">Upload feito com sucesso!</span>
          <Image src={url} alt="Uploaded" className="max-w-xs rounded shadow" />
        </div>
      )}
    </form>
  );
}
