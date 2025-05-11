import api from "./axios";

export const addWishList = async (id: any) => {
  console.log("id to be liked", id);
  try {
    const response = await api.post(
      "/wishlist",
      { productId: id },
      {
        withCredentials: true,
      }
    );
    console.log("response from server to wishlist", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWishList = async () => {
  try {
    const response = await api.get("/wishlist", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
