import axios from "axios";
import api from "./axios";

export const searchProducts = async (query: string) => {
  if (!query || query.length < 2) return [];
  const response = await api.get(`/search?q=${query}`);
  return response.data.data;
};
