import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Product = {
  id: string;
  brand: string;
  category: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  stock: number;
  images: string[];
  deleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
