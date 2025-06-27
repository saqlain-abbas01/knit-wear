import type React from "react";
import {Suspense} from 'react'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/sonner";
import TanstackProvider from "@/lib/provider/queryprovider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Knit Wear | Premium Underwear Collection",
  description:
    "Discover our premium collection of underwear for men and women designed for everyday comfort and confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TanstackProvider>
            <CartProvider>
              <div className="bg-muted/50">
               <Suspense fallback={null}>
                <Navbar />
               </Suspense>
                <div className="flex-1 overflow-x-hidden">{children}</div>
                <Footer />
              </div>
            </CartProvider>
          </TanstackProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
