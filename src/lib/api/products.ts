import { Product } from "../types";
import api from "./axios";

export const fetchRecentProducts = async () => {
  const response = await api.get("/products/recents");
  return response.data;
};

export const fetchProductById = async (id: any) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

export const fetchFilterProducts = async ({ queryKey }: any) => {
  const [_key, filters] = queryKey;
  const response = await api.get("/products", {
    params: { ...filters },
  });
  return response.data;
};
