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

export const changeUserPassword = async (email: string) => {
  console.log("data", email);
  try {
    const response = await api.post(
      `user/changePassword`,
      { email },
      {
        withCredentials: true,
      }
    );
    console.log("response update data", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetUserPassword = async (data: any) => {
  console.log("data", data);
  try {
    const response = await api.post(`user/resetPassword`, data, {
      withCredentials: true,
    });
    console.log("response update data", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userLogout = async () => {
  console.log("call logout");
  try {
    const response = await api.post(`user/logout`, null, {
      withCredentials: true,
    });
    console.log("response update data", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const googleAuth = async () => {
  console.log("call google auth");
  try {
    const response = await api.get("auth/google");
    console.log("response", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};
