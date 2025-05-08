import { CreateUser } from "../types";
import api from "./axios";
import { updatedUser } from "../types";

export const createUser = async (data: CreateUser) => {
  console.log("user to create", data);
  const response = await api.post("/auth/signUp", data);
  console.log("created User", response.data);
  return response.data;
};

export const authUser = async (data: any) => {
  try {
    const response = await api.post("/auth/signIn", data, {
      withCredentials: true,
    });
    console.log("auth User", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fecthUser = async () => {
  try {
    console.log("Current cookies:", document.cookie);
    const response = await api.get("/user/profile", {
      withCredentials: true,
    });
    console.log("response data", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (data: updatedUser) => {
  
  try {
    const response = await api.patch(`user/update`, data, {
      withCredentials: true,
    });
    console.log("response update data", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
