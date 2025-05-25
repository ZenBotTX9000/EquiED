"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import type { Transition, Variant } from "framer-motion"

// Check if the browser supports high-performance animations
export function useHighPerformanceAnimations(): boolean {
  const [supportsHighPerformance, setSupportsHighPerformance] = useState(false)

  useEffect(() => {
    // Check for hardware acceleration support
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

    // Check for device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory || 4

    // Check for high-end device based on memory and WebGL support
    setSupportsHighPerformance(!!gl && deviceMemory >= 4)
  }, [])

  return supportsHighPerformance
}

// Create optimized animation variants based on user preferences and device capabilities
export function useAnimationVariants(options: {
  reduced?: {
    duration?: number
    delay?: number
  }
  full?: {
    duration?: number
    delay?: number
    staggerChildren?: number
    delayChildren?: number
  }
}): {
  fadeIn: {
    initial: Variant
    animate: Variant
    exit: Variant
    transition: Transition
  }
  slideUp: {
    initial: Variant
    animate: Variant
    exit: Variant
    transition: Transition
  }
  slideDown: {
    initial: Variant
    animate: Variant
    exit: Variant
    transition: Transition
  }
  scale: {
    initial: Variant
    animate: Variant
    exit: Variant
    transition: Transition
  }
  staggerContainer: {
    initial: Variant
    animate: Variant
    exit: Variant
    transition: Transition
  }
  staggerItem: {
    initial: Variant
    animate: Variant
    exit: Variant
    transition: Transition
  }
} {
  const prefersReducedMotion = useReducedMotion()
  const highPerformance = useHighPerformanceAnimations()

  // Default durations
  const reducedDuration = options.reduced?.duration || 0.1
  const reducedDelay = options.reduced?.delay || 0

  const fullDuration = options.full?.duration || 0.3
  const fullDelay = options.full?.delay || 0
  const fullStaggerChildren = options.full?.staggerChildren || 0.05
  const fullDelayChildren = options.full?.delayChildren || 0.1

  // Use reduced animations if user prefers reduced motion or device is low-end
  const useReduced = prefersReducedMotion || !highPerformance

  // Animation duration based on preferences
  const duration = useReduced ? reducedDuration : fullDuration
  const delay = useReduced ? reducedDelay : fullDelay

  return {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    },
    slideUp: {
      initial: { opacity: 0, y: useReduced ? 10 : 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: useReduced ? -5 : -10 },
      transition: {
        duration: duration * 1.2,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    slideDown: {
      initial: { opacity: 0, y: useReduced ? -10 : -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: useReduced ? 5 : 10 },
      transition: {
        duration: duration * 1.2,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    scale: {
      initial: { opacity: 0, scale: useReduced ? 0.97 : 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: useReduced ? 0.97 : 0.95 },
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    staggerContainer: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: {
        staggerChildren: useReduced ? 0.02 : fullStaggerChildren,
        delayChildren: useReduced ? 0.05 : fullDelayChildren,
      },
    },
    staggerItem: {
      initial: { opacity: 0, y: useReduced ? 5 : 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: useReduced ? -5 : -10 },
      transition: {
        duration,
        ease: "easeOut",
      },
    },
  }
}

// Detect browser capabilities for animations
export function detectAnimationCapabilities(): {
  supportsWillChange: boolean
  supportsBackdropFilter: boolean
  supportsWebAnimations: boolean
  supportsIntersectionObserver: boolean
} {
  if (typeof window === "undefined") {
    return {
      supportsWillChange: false,
      supportsBackdropFilter: false,
      supportsWebAnimations: false,
      supportsIntersectionObserver: false,
    }
  }

  // Check for will-change support
  const supportsWillChange = "willChange" in document.documentElement.style

  // Check for backdrop-filter support
  let supportsBackdropFilter = false
  const prefixes = ["-webkit-", "-moz-", "-o-", "-ms-", ""]
  prefixes.forEach((prefix) => {
    if (`${prefix}backdrop-filter` in document.documentElement.style) {
      supportsBackdropFilter = true
    }
  })

  // Check for Web Animations API
  const supportsWebAnimations =
    typeof Element !== "undefined" && typeof (Element.prototype as any).animate === "function"

  // Check for Intersection Observer
  const supportsIntersectionObserver = typeof IntersectionObserver !== "undefined"

  return {
    supportsWillChange,
    supportsBackdropFilter,
    supportsWebAnimations,
    supportsIntersectionObserver,
  }
}

// Apply hardware acceleration styles to an element
export function applyHardwareAcceleration(element: HTMLElement | null): void {
  if (!element) return

  const { supportsWillChange } = detectAnimationCapabilities()

  if (supportsWillChange) {
    element.style.willChange = "transform, opacity"
  } else {
    // Fallback for browsers that don't support will-change
    element.style.transform = "translateZ(0)"
  }
}

// Remove hardware acceleration styles when no longer needed
export function removeHardwareAcceleration(element: HTMLElement | null): void {
  if (!element) return

  const { supportsWillChange } = detectAnimationCapabilities()

  if (supportsWillChange) {
    element.style.willChange = "auto"
  } else {
    element.style.transform = ""
  }
}
