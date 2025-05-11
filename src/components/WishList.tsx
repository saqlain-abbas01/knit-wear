import { fetchWishList } from "@/lib/api/wishlist";
import { Product } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ProductCart from "./ProductCart";

const WishList = () => {
  const {
    data: wishlist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => fetchWishList(),
  });
  const WishList = wishlist?.data as Product[];
  console.log("profile wishlist", WishList);

  if (isLoading) return <div>loading..</div>;
  if (error) return <div>error</div>;
  if (WishList?.length === 0)
    return (
      <>
        <div className="bg-muted/30 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Wishlist</h2>
          <p className="text-muted-foreground">Your wishlist is empty.</p>
        </div>
      </>
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <ProductCart products={WishList} />
    </div>
  );
};

export default WishList;
