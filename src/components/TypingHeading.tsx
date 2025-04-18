"use client"

import { useState, useEffect } from "react"

export default function TypingHeading() {
  const phrases = ["Comfort Meets Style", "Elegance Meets Comfort", "Style Meets Confidence", "Quality Meets Design"]
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]

    const timeout = setTimeout(
      () => {
        // If deleting
        if (isDeleting) {
          setCurrentText(currentPhrase.substring(0, currentText.length - 1))

          // If deleted completely, start typing the next phrase
          if (currentText.length === 0) {
            setIsDeleting(false)
            setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
          }
        }
        // If typing
        else {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1))

          // If typed completely, start deleting after a pause
          if (currentText.length === currentPhrase.length) {
            setTimeout(() => {
              setIsDeleting(true)
            }, 2000) // Wait 2 seconds before deleting
            return
          }
        }
      },
      isDeleting ? 50 : 100,
    ) // Type slower, delete faster

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentPhraseIndex, phrases])

  return (
    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter h-[3rem] md:h-[3.5rem] flex items-center justify-center">
      <span>{currentText}</span>
      <span className="inline-block w-[2px] h-[1.2em] bg-current ml-1 animate-blink"></span>
    </h1>
  )
}
