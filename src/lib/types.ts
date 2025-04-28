export interface Product {
  id: string;
  title: string;
  name: string;
  description: string;
  discountPercentage: number;
  price: number;
  stock: number;
  images: [string, ...string[]];
  category: "men" | "women";
  sizes: string[];
  colors: string[];
  brand: string;
}

export type Brand = {
  id: string;
  label: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUser = {
  name: string;
  email: string;
  password: string;
};

export type ApiErrorResponse = {
  message?: string;
  type?: string;
  details?: Record<string, unknown>;
};
