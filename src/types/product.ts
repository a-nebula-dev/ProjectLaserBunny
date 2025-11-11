export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[]; // Múltiplas imagens
  category: string;
  description?: string;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}
export interface ProductDB {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[]; // Múltiplas imagens
  category: string;
  description?: string;
  stock?: number;
  details?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Section {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
