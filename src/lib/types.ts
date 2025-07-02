import { z } from "zod";

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
  subCategory: string;
  size: "xl" | "xs" | "s" | "m" | "l";
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
  id?: string;
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

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  size: "xl" | "xs" | "s" | "m" | "l";
  user: string;
  createdAt: string;
  updatedAt: string;
};

export const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is too short"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code"),
});

export type ShippingFormValues = z.infer<typeof shippingSchema>;

type cartProduct = {
  id: String;
};

export type createProduct = {
  items: [
    {
      id: cartProduct;
    }
  ];
};
