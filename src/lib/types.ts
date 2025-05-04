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

type Address = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

export type UserProfile = {
  name: string;
  email: string;
  password: Buffer;
  role: string;
  image?: string;
  address: Address;
  orders: Array<Order>; // This assumes ObjectId of Order is stored as a string, but it can also be typed as ObjectId if needed
  salt: Buffer;
  createdAt: Date;
  updatedAt: Date;
};

export type updatedUser = {
  name: string;
  email: string;
  address: Address;
};
