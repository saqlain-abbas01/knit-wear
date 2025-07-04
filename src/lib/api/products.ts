import { Product } from "../types";
import api from "./axios";

export const fetchRecentProducts = async () => {
  try {
    const response = await api.get("/products/recents");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProductById = async (id: any) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFilterProducts = async ({ params, filters }: any) => {
  console.log(
    "Fetching products with filters:",
    filters,
    "and params:",
    params
  );
  try {
    const response = await api.get("/products", {
      params: { ...filters, _page: params._page, _limit: params._limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDiscountProducts = async ({
  pageParam = 1,
  pageSize = 20,
} = {}) => {
  try {
    const response = await api.get("/products/discounts", {
      params: { discount: true, _page: pageParam, _limit: pageSize },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
