import { CreateUser } from "../types";
import api from "./axios";

export const createUser = async (data: CreateUser) => {
  console.log("user to create", data);
  const response = await api.post("/auth/signUp", data);
  console.log("created User", response.data);
  return response.data;
};

export const authUser = async (data: any) => {
  try {
    const response = await api.post("/auth/signIn", data);
    console.log("auth User", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
