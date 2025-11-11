import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Endpoint para autenticação de upload direto no ImageKit
 * Retorna os parâmetros necessários para fazer upload direto do navegador
 */
export async function GET(request: NextRequest) {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !publicKey || !urlEndpoint) {
      return NextResponse.json(
        {
          success: false,
          error: "Credenciais ImageKit não configuradas",
        },
        { status: 500 }
      );
    }

    // Expire deve ser um timestamp unix NO FUTURO (<= 1 hora)
    const expire = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutos à frente

    // Gerar token randômico (usado pelo cliente) e assinar token+expire com a privateKey
    const token = crypto.randomBytes(8).toString("hex");

    // Criar assinatura (signature) usando token + expire
    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + String(expire))
      .digest("hex");

    return NextResponse.json(
      {
        token: token,
        signature: signature,
        expire: expire,
        publicKey: publicKey,
        urlEndpoint: urlEndpoint,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao gerar parâmetros de upload:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao gerar parâmetros de upload",
      },
      { status: 500 }
    );
  }
}
