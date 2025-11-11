import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    console.log("[DEBUG] POST /api/auth/admin - Iniciando");
    console.log(
      "[DEBUG] ADMIN_PASSWORD do env:",
      process.env.ADMIN_PASSWORD
        ? "definida"
        : "não definida (usando default 'admin123')"
    );

    const body = await request.json();
    console.log("[DEBUG] Body recebido:", {
      hasPassword: !!body.password,
      passwordLength: body.password?.length,
    });

    const { password } = body;

    if (!password) {
      console.log("[DEBUG] Senha não fornecida");
      return NextResponse.json(
        { success: false, error: "Senha é obrigatória" },
        { status: 400 }
      );
    }

    console.log("[DEBUG] Comparando:", {
      recebida: password,
      esperada: ADMIN_PASSWORD,
      match: password === ADMIN_PASSWORD,
    });

    if (password !== ADMIN_PASSWORD) {
      console.log("[DEBUG] Senha incorreta");
      return NextResponse.json(
        { success: false, error: "Senha incorreta" },
        { status: 401 }
      );
    }

    console.log("[DEBUG] Autenticação bem-sucedida, criando cookie");

    // Create response with auth cookie
    const response = NextResponse.json({
      success: true,
      message: "Autenticação bem-sucedida",
    });

    // Set httpOnly cookie (valid for 24 hours)
    response.cookies.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Mudado de 'strict' para 'lax' para permitir redirecionamentos
      maxAge: 86400, // 24 hours
      path: "/", // Garante que o cookie está disponível em todas as rotas
    });

    console.log("[DEBUG] Cookie definido, retornando resposta");
    return response;
  } catch (error) {
    console.error("[ERROR] Erro na autenticação:", error);
    console.error(
      "[ERROR] Stack:",
      error instanceof Error ? error.stack : "sem stack"
    );
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao autenticar",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get("admin_auth");

  if (authCookie?.value === "true") {
    return NextResponse.json({
      success: true,
      authenticated: true,
    });
  }

  return NextResponse.json({
    success: true,
    authenticated: false,
  });
}
