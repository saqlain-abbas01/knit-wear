"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingBag,
  Check,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  ChevronRight,
  Zap,
  Award,
  Users,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductById } from "@/lib/api/products";
import type { Product } from "@/lib/types";
import ImageCarouselComponent from "@/components/ImageCarouselComponent";
import { createCart } from "@/lib/api/cart";
import type { AxiosError } from "axios";
import { useCartStore } from "@/store/cartStore";
import RelatedProduct from "@/components/RelatedProduct";
import { addWishList, fetchWishList } from "@/lib/api/wishlist";

const sizes = [
  { label: "XS", value: "xs" },
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
];

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const route = useRouter();
  const queryClient = useQueryClient();

  const id = params.id;
  const category = searchParams.get("category");
  const cartUnseen = useCartStore((state) => state.markCartUnseen);

  const [filters, setFilters] = useState({
    category: category,
  });

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [wishList, setWishList] = useState<Product[]>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    console.log("Current params:", params);
  }, [params]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => fetchWishList(),
  });

  useEffect(() => {
    if (wishlist?.data) {
      setWishList(wishlist?.data);
    }
  }, [wishlist]);

  const product = data?.product as Product;

  const createMutation = useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      toast.success("Added to cart", {
        description: `${product.title} has been added to your cart`,
        action: {
          label: "View Cart",
          onClick: () => route.push("/carts"),
        },
      });
      cartUnseen();
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.response?.data;
      if (errorMessage === "Unauthorized") {
        toast.error("Unauthorized", {
          description: `Please login first to add product to carts`,
          action: {
            label: "Login In",
            onClick: () => route.push("/auth/signin"),
          },
        });
      } else {
        toast.error(`Failed To create cart: ${errorMessage}`);
      }
    },
  });

  const createWishListMutation = useMutation({
    mutationFn: addWishList,
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "View Wishlist",
          onClick: () => route.push("/carts"),
        },
      });
      cartUnseen();
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.response?.data;
      if (errorMessage === "Unauthorized") {
        toast.error("Unauthorized", {
          description: `Please login first to add product to wishlist`,
          action: {
            label: "Login In",
            onClick: () => route.push("/auth/signin"),
          },
        });
      } else {
        toast.error(`Failed To add product to wishlist try again`);
      }
    },
  });

  const isOnSale = product?.discountPercentage > 0;
  const originalPrice = isOnSale
    ? product?.price / (1 - product?.discountPercentage / 100)
    : product?.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    createMutation.mutate({
      quantity: quantity,
      product: product.id,
      size: selectedSize,
    });
  };

  const isWishlisted =
    product && wishList?.some((item: Product) => item.id === product.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product not found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <main className="container mx-auto max-w-7xl px-4 py-8 lg:py-12 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Image Gallery - 7 columns */}
          <div className="lg:col-span-7">
            <div className="sticky top-8">
              {/* Main Image */}
              <div className="relative mb-6 group">
                {isOnSale && (
                  <div className="absolute top-6 left-6 z-20">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg text-sm px-3 py-1">
                      -{Math.round(product.discountPercentage)}% OFF
                    </Badge>
                  </div>
                )}

                <div className="absolute top-6 right-6 z-20 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                    onClick={() => createWishListMutation.mutate(product.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isWishlisted ? "text-red-500 fill-red-500" : ""
                      }`}
                    />
                  </Button>
                </div>

                <div
                  className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 cursor-zoom-in shadow-2xl"
                  onClick={() => setOpen(true)}
                >
                  <Image
                    src={
                      (product?.images[selectedImageIndex] as string) ||
                      "/placeholder.svg"
                    }
                    alt={product?.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Thumbnail Images */}
              {product?.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? "border-primary shadow-lg scale-105"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={(image as string) || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Information - 5 columns */}
          <div className="lg:col-span-5">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700"
                  >
                    {product?.brand}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Premium Quality
                    </Badge>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                  {product?.name}
                </h1>

                <div className="flex items-center gap-4 flex-wrap">
                  {isOnSale ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xl text-slate-500 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                        Save ${(originalPrice - product.price).toFixed(2)}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-slate-900">
                      ${product?.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>234 people viewing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>89 sold today</span>
                  </div>
                </div>
              </div>

              {/* Product Details Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <p className="text-slate-700 leading-relaxed">
                    {product?.description}
                  </p>
                </TabsContent>
                <TabsContent value="features" className="mt-4">
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Premium quality materials
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Comfortable fit
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Durable construction
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Easy care instructions
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>

              {/* Size Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Size</h3>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-primary hover:text-primary/80"
                  >
                    Size Guide
                  </Button>
                </div>

                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="grid grid-cols-5 gap-3"
                >
                  {sizes.map((size) => (
                    <div key={size.value}>
                      <RadioGroupItem
                        value={size.value}
                        id={`size-${size.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`size-${size.value}`}
                        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 bg-white font-medium transition-all hover:border-primary hover:shadow-md peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white peer-data-[state=checked]:shadow-lg"
                      >
                        {size.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Quantity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-slate-200 rounded-xl bg-white shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-r-none hover:bg-slate-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex h-12 w-16 items-center justify-center border-x-2 border-slate-200 bg-slate-50 font-semibold text-slate-900">
                      {quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-l-none hover:bg-slate-50"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {quantity > 1 && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">
                        Total: ${(product?.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleAddToCart}
                  disabled={createMutation.isPending || !selectedSize}
                >
                  {createMutation.isPending ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Add to Cart • ${(product?.price * quantity).toFixed(2)}
                    </>
                  )}
                </Button>

                {!selectedSize && (
                  <p className="text-sm text-amber-600 text-center bg-amber-50 py-2 px-4 rounded-lg border border-amber-200">
                    Please select a size to continue
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Truck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">
                          Free Shipping
                        </p>
                        <p className="text-xs text-slate-600">
                          On orders over $50
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <RotateCcw className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">
                          Easy Returns
                        </p>
                        <p className="text-xs text-slate-600">
                          30-day return policy
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">
                          Secure Payment
                        </p>
                        <p className="text-xs text-slate-600">SSL encrypted</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Image Carousel Modal */}
        <ImageCarouselComponent
          product={product}
          open={open}
          setOpen={setOpen}
        />

        {/* Related Products */}
        <div className="mt-20 lg:mt-32">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Recommended for you
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              You may also like
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover similar products that match your style and preferences
            </p>
          </div>
          <RelatedProduct filters={filters} />
        </div>
      </main>
    </div>
  );
}
