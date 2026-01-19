import clientPromise from "./mongodb";
import { ObjectId, Db, Collection } from "mongodb";
import type { ProductDB } from "@/types/product";

type ProductRecord = ProductDB & { _id: ObjectId | string };

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db("laserBunny");
}

export async function getCollection(
  collectionName: string
): Promise<Collection> {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Funções auxiliares para produtos
export async function getAllProducts() {
  const collection = await getCollection("products");
  const docs = await collection.find({}).toArray();
  console.log("[getAllProducts] Total de produtos:", docs.length);
  const mapped = docs.map((d) => {
    const result = { ...d, id: d._id?.toString() };
    console.log("[getAllProducts] Mapeando:", {
      _id: d._id?.toString(),
      name: d.name,
      id: result.id,
    });
    return result;
  });
  return mapped;
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  console.log("[getProductById] ID recebido:", id);
  console.log("[getProductById] Validando ObjectId...");

  if (!ObjectId.isValid(id)) {
    console.log("[getProductById] ID INVÁLIDO!");
    throw new Error("ID inválido");
  }

  console.log("[getProductById] ID válido, buscando no banco...");
  const collection = await getCollection("products");

  // Tenta primeiro como ObjectId
  let doc = (await collection.findOne({ _id: new ObjectId(id) } as any)) as
    | ProductRecord
    | null;

  // Se não encontrar e o ID for uma string válida, tenta como string
  if (!doc) {
    console.log(
      "[getProductById] Não encontrado como ObjectId, tentando como string..."
    );
    doc = (await collection.findOne({ _id: id } as any)) as ProductRecord | null;
  }

  console.log(
    "[getProductById] Resultado:",
    doc ? "encontrado" : "não encontrado"
  );

  if (!doc) return null;

  // Se o _id for uma string, usa como está; se for ObjectId, converte
  const idStr = typeof doc._id === "string" ? doc._id : doc._id?.toString();
  return { ...doc, id: idStr, _id: doc._id };
}

export async function createProduct(productData: any) {
  if (!productData.name || !productData.price) {
    throw new Error("Nome e preço são obrigatórios");
  }
  const collection = await getCollection("products");
  const result = await collection.insertOne({
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return {
    _id: result.insertedId,
    id: result.insertedId.toString(),
    ...productData,
  };
}

export async function updateProduct(id: string, updateData: any) {
  console.log("[updateProduct] ID recebido:", id);
  console.log("[updateProduct] Validando ObjectId...");
  if (!ObjectId.isValid(id)) {
    console.log("[updateProduct] ID INVÁLIDO!");
    throw new Error("ID inválido");
  }

  const collection = await getCollection("products");

  // Tenta primeiro como ObjectId
  let result: any = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) } as any,
    { $set: { ...updateData, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  // Se não encontrar como ObjectId, tenta como string
  if (!result?.value) {
    console.log(
      "[updateProduct] Não encontrado como ObjectId, tentando como string..."
    );
    result = await collection.findOneAndUpdate(
      { _id: id } as any,
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
  }

  if (!result || !result.value) return null;
  const doc: any = result.value;

  // Se o _id for uma string, usa como está; se for ObjectId, converte
  const idStr = typeof doc._id === "string" ? doc._id : doc._id?.toString();
  return { ...doc, id: idStr, _id: doc._id };
}

export async function deleteProduct(id: string) {
  console.log("[deleteProduct] ID recebido:", id);

  if (!ObjectId.isValid(id)) {
    console.log("[deleteProduct] ID INVÁLIDO, tentando como string...");
  }

  const collection = await getCollection("products");

  // Tenta primeiro como ObjectId
  let result = await collection.deleteOne({ _id: new ObjectId(id) } as any);

  // Se não deletou nada como ObjectId, tenta como string
  if (result.deletedCount === 0) {
    console.log(
      "[deleteProduct] Nenhum documento deletado como ObjectId, tentando como string..."
    );
    result = await collection.deleteOne({ _id: id } as any);
  }

  return result.deletedCount > 0;
}

// Funções auxiliares para categorias
export async function getAllCategories() {
  const collection = await getCollection("categories");
  return collection.find({}).toArray();
}

export async function getCategoryById(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("categories");
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return { ...doc, id: doc._id?.toString() };
}

export async function createCategory(categoryData: any) {
  if (!categoryData.name) {
    throw new Error("Nome é obrigatório");
  }
  const collection = await getCollection("categories");
  const result = await collection.insertOne({
    ...categoryData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { _id: result.insertedId, ...categoryData };
}

export async function updateCategory(id: string, updateData: any) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("categories");
  const result: any = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) } as any,
    { $set: { ...updateData, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result || !result.value) return null;
  const doc: any = result.value;
  return { ...doc, id: doc._id?.toString() };
}

export async function deleteCategory(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("categories");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// Funções auxiliares para seções
export async function getAllSections() {
  const collection = await getCollection("sections");
  return collection.find({}).toArray();
}

export async function getSectionById(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("sections");
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return { ...doc, id: doc._id?.toString() };
}

export async function createSection(sectionData: any) {
  if (!sectionData.title) {
    throw new Error("Título é obrigatório");
  }
  const collection = await getCollection("sections");
  const result = await collection.insertOne({
    ...sectionData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { _id: result.insertedId, ...sectionData };
}

export async function updateSection(id: string, updateData: any) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("sections");
  const result: any = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) } as any,
    { $set: { ...updateData, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result || !result.value) return null;
  const doc: any = result.value;
  return { ...doc, id: doc._id?.toString() };
}

export async function deleteSection(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("sections");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
