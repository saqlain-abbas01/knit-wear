"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function ProfileSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Personal Info",
      href: "/profile?tab=profile",
      icon: User,
    },
    {
      name: "Order History",
      href: "/profile?tab=orders",
      icon: Package,
    },
    {
      name: "Addresses",
      href: "/profile?tab=addresses",
      icon: MapPin,
    },
    {
      name: "Wishlist",
      href: "/profile?tab=wishlist",
      icon: Heart,
    },
    {
      name: "Payment Methods",
      href: "/profile?tab=payment",
      icon: CreditCard,
    },
    {
      name: "Account Settings",
      href: "/profile?tab=settings",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2",
              pathname === item.href && "bg-muted"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
