"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useRef } from "react";

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

// hooks/useDebouncedCallback.ts

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function debounced(...args: Parameters<T>) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }

  return debounced;
}
