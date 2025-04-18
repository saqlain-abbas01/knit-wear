import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import AnimatedBanner from "@/components/AnimatedBanner"
import FeaturedProducts from "@/components/FeaturedProducts"
import CategoryShowcase from "@/components/CategoryShowcase"
import TypingHeading from "@/components/TypingHeading"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full">
    <AnimatedBanner />

    <section className="px-4 py-12 md:py-24 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <TypingHeading />
        <p className="text-muted-foreground md:text-xl max-w-[700px]">
          Discover our premium collection of underwear designed for everyday comfort and confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild size="lg">
            <Link href="/products?category=women">Shop Women</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/products?category=men">Shop Men</Link>
          </Button>
        </div>
      </div>
    </section>

    <CategoryShowcase />

    <section className="px-4 py-12 md:py-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">New Arrivals</h2>
        <Button variant="ghost" asChild>
          <Link href="/products" className="flex items-center gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <FeaturedProducts />
    </section>

    <section className="bg-muted/50 py-12 md:py-24 w-full">
      <div className="px-4 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            We prioritize quality, comfort, and sustainability in every piece we create.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-background p-6 rounded-lg text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
            </div>
            <h3 className="font-medium text-lg">Premium Quality</h3>
            <p className="text-muted-foreground">Crafted with the finest materials for lasting comfort.</p>
          </div>
          <div className="bg-background p-6 rounded-lg text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              </svg>
            </div>
            <h3 className="font-medium text-lg">Sustainable Practices</h3>
            <p className="text-muted-foreground">Eco-friendly production with responsible sourcing.</p>
          </div>
          <div className="bg-background p-6 rounded-lg text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M20 7h-9"></path>
                <path d="M14 17H5"></path>
                <circle cx="17" cy="17" r="3"></circle>
                <circle cx="7" cy="7" r="3"></circle>
              </svg>
            </div>
            <h3 className="font-medium text-lg">Perfect Fit</h3>
            <p className="text-muted-foreground">Designed for all body types with inclusive sizing.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  )
}
