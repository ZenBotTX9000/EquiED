"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the performance optimizer with no SSR
const PerformanceOptimizer = dynamic(() => import("@/components/performance-optimizer"), {
  ssr: false,
})

export default function PerformanceOptimizerWrapper() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Apply scroll animation observer
    const setupScrollAnimations = () => {
      // Only run if IntersectionObserver is supported
      if (typeof IntersectionObserver === "undefined") return

      const animatedElements = document.querySelectorAll("[data-animate='true']")

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-visible")

              // Optional: unobserve after animation is triggered
              if (entry.target.dataset.once === "true") {
                observer.unobserve(entry.target)
              }
            } else if (entry.target.dataset.once !== "true") {
              // Only remove the class if we want exit animations and not set to once
              entry.target.classList.remove("animate-visible")
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -10% 0px",
        },
      )

      animatedElements.forEach((element) => {
        observer.observe(element)
      })

      return () => {
        animatedElements.forEach((element) => {
          observer.unobserve(element)
        })
      }
    }

    // Setup scroll animations
    const cleanup = setupScrollAnimations()

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  if (!isMounted) return null

  return <PerformanceOptimizer />
}
