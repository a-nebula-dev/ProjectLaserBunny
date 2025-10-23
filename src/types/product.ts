import { Types } from "mongoose";

export interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductDB {
  _id?: Types.ObjectId | string;
  name: string;
  price: number;
  image: string;
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
}
