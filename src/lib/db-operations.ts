import clientPromise from "./mongodb";
import { ObjectId, Db, Collection } from "mongodb";

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
  return docs.map((d) => ({ ...d, id: d._id?.toString() }));
}

export async function getProductById(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("products");
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return { ...doc, id: doc._id?.toString() };
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
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("products");
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result || !result.value) return null;
  const doc = result.value;
  return { ...doc, id: doc._id?.toString() };
}

export async function deleteProduct(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("products");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
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
  return collection.findOne({ _id: new ObjectId(id) });
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
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  return result?.value;
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
  return collection.findOne({ _id: new ObjectId(id) });
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
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  return result?.value;
}

export async function deleteSection(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  const collection = await getCollection("sections");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
