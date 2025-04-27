import { z } from "zod";
import api from "./axios";

export const fecthAllBrands = async () => {
  try {
    const response = await api.get("/brands");
    return response.data;
  } catch (error) {
    throw error;
  }
};
