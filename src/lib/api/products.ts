import { Product } from "../types";
import api from "./axios";

export const fetchRecentProducts = async () => {
  const response = await api.get("/products/recents");
  return response.data;
};

export const fetchProductById = async (id: any) => {
  console.log("fetch  products by id", id);
  const response = await api.get(`/products/${id}`);
  console.log("response product", response.data);
  return response.data;
};

export const fetchFilterProducts = async ({ queryKey }: any) => {
  const [_key, filters] = queryKey;
  console.log("params:", filters);
  const response = await api.get("/products", {
    params: { ...filters },
  });
  console.log("filtered products", response.data);
  return response.data;
};
