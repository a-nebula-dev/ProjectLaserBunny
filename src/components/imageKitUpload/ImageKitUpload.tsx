"use client";
import { useRef, useState } from "react";
import { Button } from "../ui/button"; // shadcn/ui
import { Input } from "../ui/input"; // shadcn/ui
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import Image from "next/image";

const ImageKitUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = useRef<AbortController | null>(null);

  // Função para buscar parâmetros de autenticação
  const getAuthParams = async () => {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) throw new Error("Falha ao obter autenticação para download");
    return res.json();
  };

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    let authParams;
    try {
      authParams = await getAuthParams();
    } catch (err) {
      setError("Erro ao autenticar upload." + err);
      setLoading(false);
      return;
    }

    abortController.current = new AbortController();

    try {
      const uploadResponse = await upload({
        ...authParams,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.current.signal,
      });
      setUrl(uploadResponse.url ?? null);
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        setError("Upload cancelado.");
      } else if (error instanceof ImageKitInvalidRequestError) {
        setError("Requisição inválida: " + error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        setError("Erro de rede: " + error.message);
      } else if (error instanceof ImageKitServerError) {
        setError("Erro no servidor: " + error.message);
      } else {
        setError("Erro ao enviar imagem.");
      }
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
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button type="submit" disabled={!file || loading}>
        {loading ? "Enviando..." : "Enviar"}
      </Button>
      {loading && (
        <div className="w-full bg-zinc-200 rounded-full h-2.5 dark:bg-zinc-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {error && <span className="text-red-500">{error}</span>}
      {url && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <span className="text-green-600">Upload feito com sucesso!</span>
          <Image
            src={url}
            alt="Uploaded"
            width={300}
            height={300}
            className="max-w-xs rounded shadow"
          />
        </div>
      )}
    </form>
  );
};

export default ImageKitUpload;
