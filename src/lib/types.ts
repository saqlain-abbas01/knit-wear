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
