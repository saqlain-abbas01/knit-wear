"use client"

import { useState, useEffect, useCallback } from "react"

type TypingEffectOptions = {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayAfterType?: number
  delayAfterDelete?: number
}

export function useTypingEffect({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayAfterType = 2000,
  delayAfterDelete = 500,
}: TypingEffectOptions) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const currentFullText = texts[currentTextIndex]

  const typeText = useCallback(() => {
    if (displayedText.length < currentFullText.length) {
      setDisplayedText(currentFullText.slice(0, displayedText.length + 1))
      return true
    }
    return false
  }, [displayedText, currentFullText])

  const deleteText = useCallback(() => {
    if (displayedText.length > 0) {
      setDisplayedText(displayedText.slice(0, displayedText.length - 1))
      return true
    }
    return false
  }, [displayedText])

  useEffect(() => {
    if (isPaused) return

    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (displayedText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          typeText()
        }, typingSpeed)
      } else {
        setIsPaused(true)
        timeout = setTimeout(() => {
          setIsPaused(false)
          setIsTyping(false)
        }, delayAfterType)
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          deleteText()
        }, deletingSpeed)
      } else {
        setIsPaused(true)
        timeout = setTimeout(() => {
          setIsPaused(false)
          setIsTyping(true)
          setCurrentTextIndex((currentTextIndex + 1) % texts.length)
        }, delayAfterDelete)
      }
    }

    return () => clearTimeout(timeout)
  }, [
    displayedText,
    currentFullText,
    isTyping,
    isPaused,
    typeText,
    deleteText,
    typingSpeed,
    deletingSpeed,
    delayAfterType,
    delayAfterDelete,
    currentTextIndex,
    texts.length,
  ])

  return { text: displayedText, isTyping, isPaused }
}
