import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CategoryShowcase() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
          <Image
            src="/collection2.jfif"
            alt="Women's Collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Women's Collection</h3>
            <p className="mb-4 max-w-xs">
              Discover our range of comfortable and stylish underwear for women.
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-fit border-white text-white hover:bg-white hover:text-black"
            >
              <Link href="/products?category=women">Shop Women</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
          <Image
            src="/collection1.jfif"
            alt="Men's Collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Men's Collection</h3>
            <p className="mb-4 max-w-xs">
              Explore our selection of premium underwear designed for men's
              comfort.
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-fit border-white text-white hover:bg-white hover:text-black"
            >
              <Link href="/products?category=men">Shop Men</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
