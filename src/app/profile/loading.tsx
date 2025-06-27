"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Shirt, Heart, Sparkles } from "lucide-react"

export default function GlobalLoading() {
  const [loadingText, setLoadingText] = useState("Loading")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate loading text
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading...") return "Loading"
        return prev + "."
      })
    }, 500)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 2
      })
    }, 100)

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-28 h-28 bg-blue-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-purple-400 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="text-center space-y-8 z-10">
        {/* Main Loading Animation */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>

            {/* Inner Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Animated Icons */}
                <div className="relative w-16 h-16">
                  <ShoppingBag
                    className="absolute inset-0 w-8 h-8 text-primary animate-bounce m-auto"
                    style={{ animationDelay: "0s", animationDuration: "2s" }}
                  />
                  <Shirt
                    className="absolute inset-0 w-6 h-6 text-pink-500 animate-bounce m-auto opacity-0"
                    style={{
                      animationDelay: "0.5s",
                      animationDuration: "2s",
                      animation: "bounce 2s infinite 0.5s, fadeInOut 4s infinite",
                    }}
                  />
                  <Heart
                    className="absolute inset-0 w-5 h-5 text-red-500 animate-bounce m-auto opacity-0"
                    style={{
                      animationDelay: "1s",
                      animationDuration: "2s",
                      animation: "bounce 2s infinite 1s, fadeInOut 4s infinite 1s",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -left-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-6">
            <Sparkles className="w-3 h-3 text-pink-400 animate-pulse delay-300" />
          </div>
          <div className="absolute -bottom-4 -left-6">
            <Sparkles className="w-3 h-3 text-blue-400 animate-pulse delay-700" />
          </div>
          <div className="absolute -bottom-2 -right-4">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse delay-500" />
          </div>
        </div>

        {/* Brand Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              ComfortWear
            </h1>
            <p className="text-sm text-slate-500 font-medium tracking-wide">Premium Intimate Apparel</p>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <p className="text-lg font-medium text-slate-700 min-h-[1.75rem]">{loadingText}</p>

            {/* Progress Bar */}
            <div className="w-64 mx-auto">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">{progress}%</p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
              <Shirt className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600 font-medium">Premium Quality</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-pink-100 to-pink-50 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-xs text-slate-600 font-medium">Comfort First</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-xs text-slate-600 font-medium">Fast Delivery</p>
          </div>
        </div>

        {/* Subtle Animation Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
