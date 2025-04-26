import api from "./axios";

export const fetchRecentProducts = async () => {
  console.log("fetch recent products");
  const response = await api.get("/products/recents");
  return response.data;
};
