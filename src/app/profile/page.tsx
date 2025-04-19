"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from "@/components/profile/ProfileInfo";
import OrderHistory from "@/components/profile/OrderHistory";
import ProfileSidebar from "@/components/profile/ProfileSideBar";

// Mock user data based on the provided schema
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "user",
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },
  createdAt: "2023-01-15T00:00:00.000Z",
  updatedAt: "2023-06-20T00:00:00.000Z",
};

// Mock orders for the order history
export const mockOrders = [
  {
    id: "ord1",
    orderNumber: "ORD-123456",
    date: "2024-03-15T00:00:00.000Z",
    status: "delivered",
    total: 89.97,
    items: [
      {
        id: "item1",
        name: "Women's Comfort Brief",
        price: 19.99,
        quantity: 2,
        image: "/placeholder.svg?height=600&width=600",
      },
      {
        id: "item2",
        name: "Men's Premium Boxer Brief",
        price: 24.99,
        quantity: 2,
        image: "/placeholder.svg?height=600&width=600",
      },
    ],
  },
  {
    id: "ord2",
    orderNumber: "ORD-789012",
    date: "2024-02-28T00:00:00.000Z",
    status: "shipped",
    total: 45.98,
    items: [
      {
        id: "item3",
        name: "Women's Lace Thong",
        price: 15.99,
        quantity: 1,
        image: "/placeholder.svg?height=600&width=600",
      },
      {
        id: "item4",
        name: "Men's Athletic Trunk",
        price: 22.99,
        quantity: 1,
        image: "/placeholder.svg?height=600&width=600",
      },
      {
        id: "item5",
        name: "Women's Comfort Bralette",
        price: 29.99,
        quantity: 1,
        image: "/placeholder.svg?height=600&width=600",
      },
    ],
  },
  {
    id: "ord3",
    orderNumber: "ORD-345678",
    date: "2024-01-10T00:00:00.000Z",
    status: "processing",
    total: 67.97,
    items: [
      {
        id: "item6",
        name: "Men's Classic Brief",
        price: 18.99,
        quantity: 1,
        image: "/placeholder.svg?height=600&width=600",
      },
      {
        id: "item7",
        name: "Women's Cotton Hipster",
        price: 16.99,
        quantity: 3,
        image: "/placeholder.svg?height=600&width=600",
      },
    ],
  },
];

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);

  const updateUserInfo = (updatedInfo: Partial<typeof mockUser>) => {
    setUser({ ...user, ...updatedInfo });
  };

  return (
    <main className="container mx-auto max-w-6xl py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <ProfileSidebar />

        <div>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Personal Info</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileInfo user={user} updateUserInfo={updateUserInfo} />
            </TabsContent>

            <TabsContent value="orders">
              <OrderHistory orders={mockOrders} />
            </TabsContent>

            <TabsContent value="addresses">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h2 className="text-lg font-medium mb-4">Saved Addresses</h2>
                <p className="text-muted-foreground">
                  You haven't saved any addresses yet.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h2 className="text-lg font-medium mb-4">Wishlist</h2>
                <p className="text-muted-foreground">Your wishlist is empty.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
