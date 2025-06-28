"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CategoryShowcase() {
  return (
    <section className="px-4 py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our premium collections designed for comfort and style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Women's Collection */}
        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-r border border-primary p-[2px] hover:shadow-2xl transition-all duration-500">
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
            <Image
              src="/women-button (1).jpg"
              alt="Women's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <div className="transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <h3 className="text-xl font-bold mb-2">Women's Collection</h3>
                <p className="mb-4 text-sm opacity-90 max-w-xs">
                  Discover our range of comfortable and stylish underwear for
                  women.
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-fit border-white/80 text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  <Link href="/products?category=women">Shop Women</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Men's Collection */}
        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-r border border-primary p-[2px] hover:shadow-2xl transition-all duration-500">
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
            <Image
              src="/men-button (2).jpg"
              alt="Men's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <div className="transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <h3 className="text-xl font-bold mb-2">Men's Collection</h3>
                <p className="mb-4 text-sm opacity-90 max-w-xs">
                  Explore our selection of premium underwear designed for men's
                  comfort.
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-fit border-white/80 text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  <Link href="/products?category=men">Shop Men</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
