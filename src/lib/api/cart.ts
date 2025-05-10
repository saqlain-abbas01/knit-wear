import { CartItem } from "../types";
import api from "./axios";

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

export const deleteCart = async (id: string) => {
  console.log("cart id", id);
  try {
    const response = await api.delete(`/carts/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
