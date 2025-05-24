"use client"

import { useEffect, useRef } from "react"

// This component optimizes performance without rendering anything visible
export default function PerformanceOptimizer() {
  const frameRateRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)
  const frameCountRef = useRef<number>(0)
  const lastFpsUpdateRef = useRef<number>(0)

  useEffect(() => {
    // Monitor frame rate
    const monitorFrameRate = (timestamp: number) => {
      // Calculate FPS
      if (lastFrameTimeRef.current) {
        const delta = timestamp - lastFrameTimeRef.current
        frameCountRef.current++

        // Update FPS counter every second
        if (timestamp - lastFpsUpdateRef.current >= 1000) {
          frameRateRef.current = Math.round((frameCountRef.current * 1000) / (timestamp - lastFpsUpdateRef.current))

          // Log if frame rate drops below threshold (only in development)
          if (process.env.NODE_ENV === "development" && frameRateRef.current < 30) {
            console.warn(`Low frame rate detected: ${frameRateRef.current} FPS`)
          }

          frameCountRef.current = 0
          lastFpsUpdateRef.current = timestamp
        }
      }

      lastFrameTimeRef.current = timestamp
      requestAnimationFrame(monitorFrameRate)
    }

    requestAnimationFrame(monitorFrameRate)

    // Apply performance optimizations
    const applyOptimizations = () => {
      // Add a check to prevent unnecessary animations on low-end devices
      // Before setting up complex animations, check device performance
      const isLowEndDevice =
        window.navigator.hardwareConcurrency <= 2 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

      // Apply hardware acceleration to animated elements
      const applyHardwareAcceleration = () => {
        const animatedElements = document.querySelectorAll(
          ".will-change-transform, .will-change-opacity, .animate-gpu, [data-animate='true'], .fade-in, .slide-up, .slide-down, .scale-in",
        )

        animatedElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            // Apply hardware acceleration
            element.style.willChange = "transform, opacity"
            element.style.transform = "translateZ(0)"
            element.style.backfaceVisibility = "hidden"
          }
        })
      }

      // Optimize images
      const optimizeImages = () => {
        const images = document.querySelectorAll("img:not([loading])")
        images.forEach((img) => {
          if (img instanceof HTMLImageElement) {
            img.setAttribute("loading", "lazy")
            img.decoding = "async"
          }
        })
      }

      // Optimize event listeners
      const optimizeEventListeners = () => {
        // Use passive event listeners for touch and wheel events
        const passiveEvents = ["touchstart", "touchmove", "wheel"]
        passiveEvents.forEach((eventName) => {
          window.addEventListener(eventName, (e) => {}, { passive: true })
        })
      }

      // Run optimizations
      if (!isLowEndDevice) {
        applyHardwareAcceleration()
      }
      optimizeImages()
      optimizeEventListeners()

      // Run again after a short delay to catch dynamically added elements
      setTimeout(() => {
        if (!isLowEndDevice) {
          applyHardwareAcceleration()
        }
        optimizeImages()
      }, 1000)

      return () => {
        // Cleanup if needed
      }
    }

    const cleanup = applyOptimizations()

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  // This component doesn't render anything
  return null
}
