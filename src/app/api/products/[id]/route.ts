import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/db-operations";

// GET - Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("[GET /api/products/[id]] ID recebido:", id);
    console.log(
      "[GET /api/products/[id]] ObjectId.isValid?:",
      id.length === 24
    );

    const product = await getProductById(id);
    console.log(
      "[GET /api/products/[id]] Produto encontrado:",
      product ? "SIM" : "NÃO"
    );

    if (!product) {
      console.log("[GET /api/products/[id]] Retornando 404");
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao buscar produto";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

// PUT - Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Log incoming data for debugging when clients receive unexpected responses
    console.log("[api/products/[id] PUT] id:", id);
    console.log("[api/products/[id] PUT] body:", body);

    // Normalize update data: use first image as main if images provided
    const updateData = {
      ...body,
      image: body.image || body.images?.[0] || "",
    };

    const updatedProduct = await updateProduct(id, updateData);

    console.log("[api/products/[id] PUT] updatedProduct:", updatedProduct);

    if (!updatedProduct) {
      // Alguns produtos foram salvos com _id como string; em alguns casos
      // o update pode retornar null mesmo que o documento tenha sido modificado.
      // Para evitar falsos negativos, tentamos buscar o produto após a
      // tentativa de update e, se existir, consideramos como sucesso.
      console.log(
        "[api/products/[id] PUT] updatedProduct is null, verifying existence..."
      );
      const existing = await getProductById(id).catch((e) => {
        console.log(
          "[api/products/[id] PUT] getProductById erro ao verificar:",
          e
        );
        return null;
      });

      if (existing) {
        console.log(
          "[api/products/[id] PUT] Produto encontrado após tentativa de update — tratando como sucesso"
        );
        return NextResponse.json({
          success: true,
          message: "Produto atualizado (confirmado)",
          data: existing,
        });
      }

      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produto atualizado com sucesso",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao atualizar produto";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

// DELETE - Remover produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, try to fetch the product so we can remove its images from ImageKit
    let product: any = null;
    try {
      product = (await getProductById(id)) as any;
    } catch (e) {
      console.log(
        "[DELETE /api/products/[id]] erro ao buscar produto antes de deletar:",
        e
      );
      product = null;
    }

    // Helper to delete a single ImageKit URL
    const deleteImageFromImageKit = async (imageUrl: string) => {
      try {
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";
        if (!privateKey) {
          console.log(
            "[DELETE] IMAGEKIT_PRIVATE_KEY não configurada, pulando deleção de imagem"
          );
          return false;
        }

        const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString(
          "base64"
        )}`;

        // Normalize URL/path so we can find the underlying ImageKit fileId via the media API.
        const getNormalizedPath = () => {
          try {
            const parsed = new URL(imageUrl);
            if (urlEndpoint && imageUrl.startsWith(urlEndpoint)) {
              return parsed.pathname.replace(/^\/+/, "");
            }
            return parsed.pathname.replace(/^\/+/, "");
          } catch (err) {
            return imageUrl.replace(/^\/+/, "");
          }
        };

        const normalizedPath = getNormalizedPath().split("?")[0];
        const baseUrl = "https://api.imagekit.io/v1/files";

        const searchQueries: string[] = [];
        if (normalizedPath) {
          const cleanPath = normalizedPath.replace(/^\/+/, "");
          const fileName = cleanPath.split("/").pop();
          if (fileName) {
            searchQueries.push(`name="${fileName}"`);
          }
        }

        // Deduplicate queries to avoid redundant calls.
        const uniqueQueries = Array.from(new Set(searchQueries));

        let fileId: string | null = null;
        for (const query of uniqueQueries) {
          try {
            const searchUrl = `${baseUrl}?searchQuery=${encodeURIComponent(
              query
            )}&limit=1`;
            const lookup = await fetch(searchUrl, {
              headers: {
                Authorization: authHeader,
              },
            });

            if (!lookup.ok) {
              const detail = await lookup.text();
              console.debug(
                `[DELETE] lookup sem resultado para query ${query}:`,
                lookup.status,
                detail
              );
              continue;
            }

            const result = await lookup.json();
            if (Array.isArray(result) && result.length > 0) {
              const item = result[0];
              if (item?.fileId) {
                fileId = item.fileId as string;
                break;
              }
            }
          } catch (lookupErr) {
            console.log(
              `[DELETE] Erro ao buscar fileId no ImageKit (${query}):`,
              lookupErr
            );
          }
        }

        if (!fileId) {
          const maybeFileId = normalizedPath.replace(/\?.*$/, "");
          if (/^[a-f0-9]{24}$/i.test(maybeFileId)) {
            fileId = maybeFileId;
          }
        }

        if (!fileId) {
          console.log(
            "[DELETE] Não foi possível resolver fileId para imagem:",
            imageUrl
          );
          return false;
        }

        const apiUrl = `https://api.imagekit.io/v1/files/${encodeURIComponent(
          fileId
        )}`;

        const res = await fetch(apiUrl, {
          method: "DELETE",
          headers: {
            Authorization: authHeader,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.log(
            "[DELETE] Falha ao deletar imagem no ImageKit:",
            fileId,
            res.status,
            text
          );
          return false;
        }

        console.log("[DELETE] Imagem deletada no ImageKit:", fileId);
        return true;
      } catch (err) {
        console.log("[DELETE] Erro ao tentar deletar imagem no ImageKit:", err);
        return false;
      }
    };

    // If we have a product and it has images, attempt to delete them (best-effort)
    if (product && (product.images || product.image)) {
      const images: string[] = [];
      if (Array.isArray(product.images))
        images.push(...(product.images as string[]));
      if (product.image && !images.includes(product.image))
        images.push(product.image as string);

      for (const img of images) {
        try {
          await deleteImageFromImageKit(img);
        } catch (e) {
          console.log("[DELETE] Erro ignorado ao deletar imagem:", e);
        }
      }
    }

    // Finally delete product from DB (this already handles string/ObjectId cases)
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produto removido com sucesso",
      deletedId: id,
    });
  } catch (error) {
    console.error("Erro ao remover produto:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao remover produto";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
