import { CartItem } from "../types";
import api from "./axios";

interface DeleteCartOptions {
  id: string; // optional cart ID
  deleteAll: boolean; // optional flag to delete all
}

export const createCart = async (data: any) => {
  try {
    const response = await api.post(`/carts`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fecthCarts = async () => {
  try {
    const response = await api.get("/carts", {
      withCredentials: true,
    });
    console.log("carts", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCart = async (data: any) => {
  const { cartId } = data;
  try {
    const response = await api.put(`/carts/${cartId}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCart = async ({
  id,
  deleteAll = false,
}: DeleteCartOptions) => {
  try {
    const url = deleteAll ? `/carts?all=true` : `/carts/${id}`;

    const response = await api.delete(url, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to delete cart:", error);
    throw error;
  }
};
