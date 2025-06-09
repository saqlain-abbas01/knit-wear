"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      image: "/banner1.jpg",
      alt: "New collection just dropped",
    },
    {
      image: "/banner2.jpg",
      alt: "Limited time offer: 20% off sitewide",
    },
    {
      image: "/banner.jpg",
      alt: "Free shipping on orders over $50",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="relative h-[300px] md:h-[480px] w-screen left-[50%] right-[50%] mx-[-50vw] overflow-hidden">
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
              src={banners[currentBanner].image || "/placeholder.svg"}
              alt={banners[currentBanner].alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-white text-center px-4">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  {banners[currentBanner].alt}
                </h2>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
