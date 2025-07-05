"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userLogout } from "@/lib/api/user";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/lib/types";
import { disconnectSocket } from "@/lib/connectSocket";

export default function ProfileSidebar({
  activeTab,
  onChangeTab,
}: {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();

  const navItems = [
    {
      name: "Personal Info",
      value: "profile",
      href: "/profile?tab=profile",
      icon: User,
    },
    {
      name: "Order History",
      value: "orders",
      href: "/profile?tab=orders",
      icon: Package,
    },
    {
      name: "Wishlist",
      value: "wishlist",
      href: "/profile?tab=wishlist",
      icon: Heart,
    },
  ];

  const mutation = useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      toast.success(`User logout sucessfully`);
      queryClient.clear();
      window.location.href = "/auth/signin";
      disconnectSocket();
      router.refresh();
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message;
      toast.error(`Error while loging out please try again..`);
    },
  });

  const handleLogOut = () => {
    mutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 cursor-pointer",
              activeTab === item.value && "bg-muted"
            )}
            onClick={() => onChangeTab(item.value)} // <- switch tab
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full cursor-pointer justify-start gap-2 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={handleLogOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
