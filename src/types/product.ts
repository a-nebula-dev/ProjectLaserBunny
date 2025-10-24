export interface Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
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
