"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Home, Search, ShoppingBag, ArrowLeft, Mail, Phone, MapPin, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="text-center space-y-8">
          {/* Error Code with Animation */}
          <div className="relative">
            <div className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-gradient-to-r from-primary/20 to-primary/10 bg-clip-text leading-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-full p-8">
                <Sparkles className="h-16 w-16 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Oops! Page Not Found</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              The page you're looking for seems to have wandered off. Don't worry, even the best explorers sometimes
              take a wrong turn!
            </p>
          </div>

          {/* Search Bar */}
          <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="text-sm font-medium text-slate-700 mb-3">Try searching for what you need:</div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-2 border-slate-200 focus:border-primary"
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12 px-6">
                    Search
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => router.push("/")}
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 hover:bg-slate-50 bg-transparent"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Fun Message */}
          <div className="max-w-lg mx-auto">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Fun Fact: You're one of the few people to see this page!
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
