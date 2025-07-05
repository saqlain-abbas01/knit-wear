"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  Heart,
  Package,
  LogOut,
  Settings,
  X,
  ChevronDown,
  Gift,
  Star,
  Crown,
  Shirt,
  Zap,
  Moon,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fecthUser, userLogout } from "@/lib/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { ApiErrorResponse, UserProfile } from "@/lib/types";
import { useUserStore } from "@/store/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCartStore } from "@/store/cartStore";
import SearchComponent from "./SearchProducts";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { connectSocket, disconnectSocket } from "@/lib/connectSocket";

const routes = [
  { name: "Home", path: "/" },
  { name: "Women", path: "/products?category=women" },
  { name: "Men", path: "/products?category=men" },
];

const womenCategories = [
  {
    name: "All Women",
    path: "/products?category=women",
    icon: Crown,
    description: "Browse all women's collection",
  },
  {
    name: "Bras",
    path: "/products?category=women&type=bras",
    icon: Heart,
    description: "Comfortable & stylish bras",
  },
  {
    name: "Panties",
    path: "/products?category=women&type=panties",
    icon: Star,
    description: "Everyday essentials",
  },
  {
    name: "Lingerie Sets",
    path: "/products?category=women&type=sets",
    icon: Gift,
    description: "Complete matching sets",
  },
  {
    name: "Sleepwear",
    path: "/products?category=women&type=sleepwear",
    icon: Moon,
    description: "Cozy nightwear",
  },
  {
    name: "Shapewear",
    path: "/products?category=women&type=shapewear",
    icon: Zap,
    description: "Smoothing & shaping",
  },
  {
    name: "Loungewear",
    path: "/products?category=women&type=loungewear",
    icon: Shirt,
    description: "Relaxed comfort wear",
  },
];

const menCategories = [
  {
    name: "All Men",
    path: "/products?category=men",
    icon: Crown,
    description: "Browse all men's collection",
  },
  {
    name: "Underwear",
    path: "/products?category=men&type=underwear",
    icon: Star,
    description: "Premium underwear",
  },
  {
    name: "Boxers",
    path: "/products?category=men&type=boxers",
    icon: Heart,
    description: "Comfortable boxers",
  },
  {
    name: "Undershirts",
    path: "/products?category=men&type=undershirts",
    icon: Shirt,
    description: "Essential undershirts",
  },
  {
    name: "Loungewear",
    path: "/products?category=men&type=loungewear",
    icon: Zap,
    description: "Casual comfort wear",
  },
  {
    name: "Sleepwear",
    path: "/products?category=men&type=sleepwear",
    icon: Moon,
    description: "Comfortable sleepwear",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const carts = useCartStore((state) => state.totalItems);
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
      toast.success(`User logout successfully`);
      queryClient.clear();
      router.push("/auth/signin");
      setProfile(undefined);
      disconnectSocket();
      router.refresh();
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message;
      toast.error(`Error while logging out please try again..`);
    },
  });

  useEffect(() => {
    if (data?.user) {
      connectSocket(data.user.id);
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="border-b border-border/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-10">
          <div className="flex  h-16 items-center justify-between">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="lg:hidden  flex gap-1">
                  <Menu className="h-5 w-5" />
                  <p className="text-base sm:hidden">LUXE INTIMATES</p>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 px-2 py-4">
                  <Link
                    href="/"
                    className="text-xl sm:text-2xl font-bold tracking-tight"
                  >
                    LUXE INTIMATES
                  </Link>

                  {/* <div className="w-full">
                    <SearchComponent />
                  </div> */}

                  <nav className="flex flex-col gap-2">
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Shop
                    </h3>
                    {routes.map((route) => {
                      const isActive = currentPath === route.path;
                      return (
                        <Link
                          key={route.path}
                          href={route.path}
                          className={cn(
                            "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            isActive &&
                              "bg-accent text-accent-foreground border-l-2 border-primary"
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

            {/* Logo */}
            <div className="flex  items-center">
              <Link
                href="/"
                className="text-base font-bold tracking-tight lg:text-2xl hidden sm:block"
              >
                LUXE INTIMATES
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden flex-1 justify-center px-8 lg:flex">
              <div className="w-full max-w-md">
                <SearchComponent />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    {profile?.image ? (
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={profile.image || "/placeholder.svg"}
                          alt="User Avatar"
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <span className="sr-only">Account menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {profile ? (
                    <>
                      <div className="flex items-center gap-2 p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={profile.image || "/placeholder.svg"}
                            alt="User Avatar"
                          />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {profile.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      {pathname !== "/" && (
                        <DropdownMenuItem onClick={() => router.push("/")}>
                          <Home className="mr-2 h-4 w-4" />
                          Home
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/profile?tab=orders")}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/profile?tab=wishlist")}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => router.push("/auth/signin")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Shopping Cart */}
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/carts" onClick={() => markCartSeen()}>
                  <ShoppingCart className="h-5 w-5" />
                  {carts > 0 && !cartSeen && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {carts > 99 ? "99+" : carts}
                    </Badge>
                  )}
                  <span className="sr-only">Shopping cart</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="border-b border-border/40 bg-background/95 p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchComponent />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Navigation - Only on Homepage */}

      <div
        className={cn(
          "hidden border-b border-border/40 lg:block transition-all duration-300 ease-in-out",
          isScrolled
            ? "opacity-0 -translate-y-full h-0 overflow-hidden"
            : "opacity-100 translate-y-0"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-10">
          <nav className="flex h-14 items-center">
            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList className="gap-8">
                {/* Home Link */}
                <NavigationMenuItem>
                  <Link href="/" passHref>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        currentPath === "/" &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* Women Navigation */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      currentPath.includes("category=women") &&
                        "bg-transparent text-accent-foreground cursor-pointer"
                    )}
                  >
                    Women
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-lg gap-3 p-4">
                      <div className="row-span-3">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium leading-none mb-1">
                            Women's Collection
                          </h4>
                          <p className="text-xs leading-snug text-muted-foreground">
                            Premium intimates & loungewear
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 ">
                          {womenCategories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                              <Link
                                key={category.path}
                                href={category.path}
                                passHref
                              >
                                <NavigationMenuLink className="col-span-1 w-full group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                                    <div className="text-sm font-medium leading-none">
                                      {category.name}
                                    </div>
                                  </div>
                                  <p className="line-clamp-2 pl-6 text-xs leading-snug text-muted-foreground">
                                    {category.description}
                                  </p>
                                </NavigationMenuLink>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Men Navigation */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      currentPath.includes("category=men") &&
                        "bg-accent text-accent-foreground cursor-pointer"
                    )}
                  >
                    Men
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-lg gap-3 p-4">
                      <div className="row-span-3">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium leading-none mb-1">
                            Men's Collection
                          </h4>
                          <p className="text-xs leading-snug text-muted-foreground">
                            Comfort & style essentials
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {menCategories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                              <Link
                                key={category.path}
                                href={category.path}
                                legacyBehavior
                                passHref
                              >
                                <NavigationMenuLink className="col-span-1 group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                                    <div className="text-sm font-medium leading-none">
                                      {category.name}
                                    </div>
                                  </div>
                                  <p className="line-clamp-2 pl-6 text-xs leading-snug text-muted-foreground">
                                    {category.description}
                                  </p>
                                </NavigationMenuLink>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Featured Links */}
            <div
              className="ml-auto flex items-center gap-1
              "
            >
              <Link
                href="#new-arrivals"
                scroll={true}
                className="text-sm text-primary font-medium  hover:text-foreground transition-colors"
              >
                New Arrivals
              </Link>
              <Button
                variant={"ghost"}
                className="text-sm  font-medium text-red-600"
                onClick={() => router.push("/sale")}
              >
                Sale
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
