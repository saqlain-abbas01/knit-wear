"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import { fecthUser } from "@/lib/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserProfile } from "@/lib/types";
import { useUserStore } from "@/store/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>();

  const routes = [
    { name: "Home", path: "/" },
    { name: "Women", path: "/products?category=women" },
    { name: "Men", path: "/products?category=men" },
  ];

  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fecthUser,
  });

  console.log("profile", profile);

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
      setProfile(data.user);
    } else if (!isLoading && !data?.user) {
      clearUser();
    }
  }, [data]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className=" mx-auto max-w-7xl container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  {route.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 ml-4 md:ml-0">
          <Link href="/" className="font-bold text-xl">
            LUXE INTIMATES
          </Link>
        </div>

        <nav className="mx-6 hidden md:flex md:items-center md:gap-5 lg:gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.path && "text-primary"
              )}
            >
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          {isSearchOpen ? (
            <div className="flex items-center border rounded-md overflow-hidden">
              <Input
                placeholder="Search..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {profile?.image ? (
                    <Avatar>
                      <AvatarImage
                        src={profile.image || "/placeholder.svg"}
                        alt="User Avatar"
                      />
                      <AvatarFallback>
                        <User className="text-gray-500" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarFallback>
                        <User className="text-gray-500" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {profile ? (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => router.push("/auth/signin")}>
                    Login
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/carts">
              <ShoppingBag className="h-6 w-6" />
              <span className="sr-only">Cart</span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                3
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
