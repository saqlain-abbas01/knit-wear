"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileSidebar from "@/components/profile/ProfileSideBar";
import { useUserStore } from "@/store/userStore";
import OrderHistory from "@/components/profile/OrderHistory";
import WishList from "@/components/WishList";

export default function ProfilePage() {
  // const data = { name: "string", email: "string@gmail.com" };
  const user = useUserStore((state) => state.user);

  return (
    <main className="container mx-auto max-w-7xl py-8 md:py-12">
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
              {user ? (
                <ProfileInfo user={user} />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-gray-500">
                  <span className="text-lg font-medium">
                    You are not logged in
                  </span>
                  <p className="text-sm">
                    Please sign in to view your profile information.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              {user ? (
                <OrderHistory orders={user?.orders} />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-gray-500">
                  <span className="text-lg font-medium">
                    You are not logged in
                  </span>
                  <p className="text-sm">
                    Please sign in to view your orders information.
                  </p>
                </div>
              )}
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
              <WishList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
