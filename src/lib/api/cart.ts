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
