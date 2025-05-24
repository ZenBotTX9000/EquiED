"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

interface GSAPSmoothScrollProps {
  children: ReactNode
  speed?: number
  smooth?: number
  effects?: boolean
}

export default function GSAPSmoothScroll({ children, speed = 1, smooth = 1, effects = true }: GSAPSmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const smootherRef = useRef<any>(null)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Don't apply smooth scrolling if user prefers reduced motion
    if (prefersReducedMotion) {
      return
    }

    // Initialize ScrollSmoother
    if (wrapperRef.current && contentRef.current) {
      // Create ScrollSmoother instance
      smootherRef.current = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: smooth,
        effects: effects,
        normalizeScroll: true, // Prevents jarring scroll behavior on some devices
        ignoreMobileResize: true, // Helps with mobile browser address bar issues
        smoothTouch: 0.1, // Light smoothing for touch devices
      })

      // Set scroll speed
      if (speed !== 1) {
        smootherRef.current.effects(".gsap-speed-section", { speed: speed })
      }
    }

    // Refresh ScrollTrigger on window resize for responsive layouts
    const handleResize = () => {
      ScrollTrigger.refresh(true)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      // Clean up
      window.removeEventListener("resize", handleResize)

      if (smootherRef.current) {
        smootherRef.current.kill()
      }

      // Kill all ScrollTriggers to prevent memory leaks
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [speed, smooth, effects])

  return (
    <div ref={wrapperRef} id="smooth-wrapper" className="h-full overflow-hidden">
      <div ref={contentRef} id="smooth-content" className="h-full">
        {children}
      </div>
    </div>
  )
}
