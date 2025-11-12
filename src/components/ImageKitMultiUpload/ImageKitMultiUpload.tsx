"use client";

import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface ImageKitMultiUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageKitMultiUpload({
  value,
  onChange,
  maxImages = 4,
}: ImageKitMultiUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = useRef<AbortController | null>(null);

  // Função para buscar parâmetros de autenticação
  const getAuthParams = async () => {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) throw new Error("Falha ao obter autenticação para upload");

    const payload = await res.json();
    if (!payload?.success || !payload?.data) {
      throw new Error("Resposta inválida ao obter autenticação");
    }

    const { token, signature, expire, publicKey, urlEndpoint } = payload.data;

    if (!publicKey || !token || !signature || !expire) {
      throw new Error("Parâmetros de upload incompletos");
    }

    return { token, signature, expire, publicKey, urlEndpoint };
  };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validar se já atingiu o limite
    if (value.length >= maxImages) {
      setError(`Limite de ${maxImages} imagens atingido`);
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    let authParams;
    try {
      authParams = await getAuthParams();
    } catch (err) {
      setError("Erro ao autenticar upload.");
      setLoading(false);
      return;
    }

    abortController.current = new AbortController();

    try {
      const uploadResponse = await upload({
        token: authParams.token,
        signature: authParams.signature,
        expire: authParams.expire,
        publicKey: authParams.publicKey,
        file,
        fileName: `product-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        useUniqueFileName: false, // Desativa o nome único do ImageKit
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.current.signal,
      });

      if (uploadResponse.url) {
        const newUrls = [...value, uploadResponse.url];
        onChange(newUrls);
        setError(null);
      }
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
    } finally {
      setLoading(false);
      setProgress(0);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">
          Imagens do Produto ({value.length}/{maxImages})
        </Label>

        {/* Área de upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-center gap-3">
            <Upload className="w-5 h-5 text-gray-400" />
            <div className="text-center">
              <Label
                htmlFor="image-input"
                className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700"
              >
                Clique para enviar
              </Label>
              <Input
                id="image-input"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleUpload}
                disabled={loading || value.length >= maxImages}
                className="hidden"
              />
              <p className="text-xs text-gray-500">
                {value.length >= maxImages
                  ? `Limite de ${maxImages} imagens atingido`
                  : "PNG, JPG ou GIF"}
              </p>
            </div>
          </div>

          {loading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enviando... {Math.round(progress)}%
              </p>
            </div>
          )}

          {error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Grid de imagens */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={url}
                    alt={`Produto ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Badge com ordem */}
                <div className="absolute top-2 left-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>

                {/* Botão de remover */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover imagem"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
