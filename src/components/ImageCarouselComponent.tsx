"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Product } from "@/lib/types";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCarouselProps {
  product: Product;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ImageCarouselComponent = ({
  product,
  open,
  setOpen,
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const hasMultipleImages = product.images && product.images.length > 1;

  // Create API for the carousel
  const [api, setApi] = useState<any>(null);

  // Update current index when slide changes
  useEffect(() => {
    if (!api) return;

    const onChange = (api: any) => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onChange);
    return () => {
      api.off("select", onChange);
    };
  }, [api]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        api?.scrollPrev();
      } else if (e.key === "ArrowRight") {
        api?.scrollNext();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, api, setOpen]);

  // Reset to first slide when dialog opens
  useEffect(() => {
    if (open && api) {
      setCurrentIndex(0);
      api.scrollTo(0);
    }
  }, [open, api]);

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === (product.images?.length || 0) - 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background backdrop-blur-sm border-none">
        <div
          className={cn(
            "relative w-full transition-all duration-300",
            isZoomed ? "cursor-zoom-out" : "cursor-default"
          )}
        >
          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 right-4 z-50 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentIndex + 1} / {product.images?.length}
            </div>
          )}

          {/* Zoom button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 left-4 z-50 bg-black/60 text-white rounded-full hover:bg-black/80"
          >
            {isZoomed ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <ZoomIn className="h-4 w-4" />
            )}
          </Button>

          <Carousel className="w-full " setApi={setApi}>
            <CarouselContent
              className={cn(
                "transition-all duration-300 w-full p-0 m-0",
                isZoomed ? "scale-150" : "scale-100"
              )}
            >
              {product.images?.map((img, i) => (
                <CarouselItem
                  key={i}
                  onClick={() => isZoomed && setIsZoomed(false)}
                  className="p-0 m-0 w-full"
                >
                  <div
                    className={cn(
                      "relative w-full  h-[300px] md:h-[400px] lg:h-[500px] p-0",
                      "transition-all duration-500 ease-in-out"
                    )}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name || "Product"} ${i + 1}`}
                      fill
                      className={cn(
                        " rounded-lg w-full h-full",
                        "transition-all duration-300"
                      )}
                      priority={i === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Only show navigation buttons if there are multiple images */}
            {hasMultipleImages && (
              <>
                <CarouselPrevious
                  className={cn(
                    "absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white border-none hover:bg-black/80",
                    "transition-opacity duration-200",
                    isFirstSlide
                      ? "opacity-40 cursor-not-allowed"
                      : "opacity-100",
                    isZoomed && "hidden"
                  )}
                  disabled={isFirstSlide}
                  onClick={(e) => {
                    if (isFirstSlide) e.preventDefault();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </CarouselPrevious>

                <CarouselNext
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white border-none hover:bg-black/80",
                    "transition-opacity duration-200",
                    isLastSlide
                      ? "opacity-40 cursor-not-allowed"
                      : "opacity-100",
                    isZoomed && "hidden"
                  )}
                  disabled={isLastSlide}
                  onClick={(e) => {
                    if (isLastSlide) e.preventDefault();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </CarouselNext>
              </>
            )}
          </Carousel>

          {/* Dots indicator */}
          {hasMultipleImages && !isZoomed && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {product.images?.map((_, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    currentIndex === i
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/80"
                  )}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarouselComponent;
