import api from "./axios";

export const createOrder = async (data: any) => {
  try {
    const response = await api.post(`/orders`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
