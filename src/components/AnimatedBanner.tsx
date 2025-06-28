"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AnimatedBanner() {
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      image: "/new-banner-1.jpg",
      alt: "New collection just dropped",
      objectFit: "cover" as const,
    },
    {
      image: "/banner2.jpg",
      alt: "Limited time offer: 20% off sitewide",
      objectFit: "cover" as const,
    },
    {
      image: "/banner.jpg",
      alt: "Free shipping on orders over $50",
      objectFit: "cover" as const,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 100000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleButtonClick = () => {
    router.push("/products");
  };

  return (
    <div className="relative h-[300px] md:h-[480px] w-screen lg:h-[530px] left-[50%] right-[50%] mx-[-50vw] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentBanner}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="relative w-full h-full">
            <Image
              src={
                banners[currentBanner].image ||
                "/placeholder.svg?height=480&width=1920"
              }
              alt={banners[currentBanner].alt}
              fill
              className={`${
                banners[currentBanner].objectFit === "cover"
                  ? "object-cover"
                  : "w-full h-full"
              }`}
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50 flex items-center justify-center">
              <div className="text-white text-center px-4 max-w-4xl">
                <motion.h2
                  className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {banners[currentBanner].alt}
                </motion.h2>
                <motion.button
                  className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  onClick={handleButtonClick}
                >
                  Shop Now
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Banner indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentBanner
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() =>
          setCurrentBanner(
            (prev) => (prev - 1 + banners.length) % banners.length
          )
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Previous banner"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Next banner"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
