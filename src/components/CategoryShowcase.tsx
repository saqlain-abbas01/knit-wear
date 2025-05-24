"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CategoryShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cards = cardsRef.current;

    // Set initial state
    gsap.set(cards, {
      y: 150,
      opacity: 0,
      scale: 0.6,
    });

    // Create scroll trigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(cards, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.3,
      ease: "back.out(1.7)",
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section
      ref={containerRef}
      className="container mx-auto max-w-6xl px-4 py-10"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our premium collections designed for comfort and style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div
          ref={addToRefs}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[2px] hover:shadow-2xl transition-all duration-500"
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
            <Image
              src="/placeholder.svg?height=400&width=300"
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

        <div
          ref={addToRefs}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-[2px] hover:shadow-2xl transition-all duration-500"
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
            <Image
              src="/placeholder.svg?height=400&width=300"
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
