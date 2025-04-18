import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import  {ThemeProvider}  from "@/components/ThemeProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
import AnimatedBanner from "@/components/AnimatedBanner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Luxe Intimates | Premium Underwear Collection",
  description:
    "Discover our premium collection of underwear for men and women designed for everyday comfort and confidence.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="overflow-x-hidden ">
            <Navbar />
            <div className="flex-1 mx-auto max-w-7xl">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
