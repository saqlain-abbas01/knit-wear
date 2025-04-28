import api from "./axios";

export const createCart = async (data: any) => {
  const response = await api.post("/carts");
  return response.data;
};
