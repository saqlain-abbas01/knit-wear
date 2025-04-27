import api from "./axios";

export const fetchRecentProducts = async () => {
  console.log("fetch recent products");
  const response = await api.get("/products/recents");
  return response.data;
};

export const fetchFilterProducts = async ({ queryKey }: any) => {
  const [_key, filters] = queryKey;
  console.log("params:", filters);
  const response = await api.get("/products", {
    params: { ...filters },
  });
  return response.data;
};
