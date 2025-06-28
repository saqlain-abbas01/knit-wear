"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingBag,
  ShoppingCartIcon,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fecthUser, userLogout } from "@/lib/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ApiErrorResponse, UserProfile } from "@/lib/types";
import { useUserStore } from "@/store/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCartStore } from "@/store/cartStore";
import SearchProducts from "./SearchProducts";
import SearchComponent from "./SearchProducts";
import { AxiosError } from "axios";
import { toast } from "sonner";

const routes = [
  { name: "Home", path: "/" },
  { name: "Women", path: "/products?category=women" },
  { name: "Men", path: "/products?category=men" },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>();

  const carts = useCartStore((state) => state.storeCarts);
  const cartSeen = useCartStore((state) => state.cartSeen);

  const queryClient = useQueryClient();

  const currentPath = `${pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const markCartSeen = useCartStore((state) => state.markCartSeen);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fecthUser,
  });

  const mutation = useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      toast.success(`User logout sucessfully`);
      queryClient.clear();
      router.push("/auth/signin");
      setProfile(undefined);
      router.refresh();
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message;
      toast.error(`Error while loging out please try again..`);
    },
  });

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
      setProfile(data.user);
    } else if (!isLoading && !data?.user) {
      clearUser();
    }
  }, [data]);

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="border-b">
        <div className="max-w-7xl container mx-auto  flex justify-around  h-16  gap-2 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6">
                <Link href="/" className="font-bold text-xl">
                  LUXE INTIMATES
                </Link>

                <div className="w-full">
                  <SearchComponent />
                </div>

                <nav className="flex flex-col gap-4">
                  {routes.map((route) => {
                    const isActive = currentPath === route.path;

                    return (
                      <Link
                        key={route.path}
                        href={route.path}
                        className={cn(
                          "ml-4 text-sm font-medium transition-colors hover:text-primary",
                          isActive && "text-primary  border-primary pb-[2px]"
                        )}
                      >
                        {route.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 ml-4 md:ml-0">
            <Link href="/" className="font-bold text-xl">
              LUXE INTIMATES
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-10 ">
            <SearchComponent />
          </div>

          <div className="flex items-center gap-2 ml-auto ">
            <ThemeToggle />

            <Button variant="ghost" size="icon">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    {profile?.image ? (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={profile.image} alt="User Avatar" />
                        <AvatarFallback>
                          <User className="text-gray-500" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>
                          <User className="text-gray-500" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span className="sr-only">Account</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {profile ? (
                    <>
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => router.push("/auth/signin")}
                    >
                      Login
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/carts">
                <div className="relative " onClick={() => markCartSeen()}>
                  <ShoppingCartIcon className="w-8 h-8" />
                  {!cartSeen && carts.length > 0 && (
                    <span className="absolute -top-3 left-4 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {carts.length}
                    </span>
                  )}
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="border-b hidden md:flex">
        <nav className="max-w-7xl container mx-auto flex h-12 gap-4 items-center">
          <Button className="h-full w-42 rounded-none px-4 flex items-center gap-2">
            <Menu className="w-4 h-4" />
            Categories
          </Button>

          {routes.map((route) => {
            const isActive = currentPath === route.path;

            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "ml-4 text-sm font-medium transition-colors hover:text-primary",
                  isActive && "text-primary  border-primary pb-[2px]"
                )}
              >
                {route.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

{
  /* <nav className="mx-6 hidden md:flex md:items-center md:gap-5 lg:gap-6">
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
        </nav> */
}
