"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import { durations, easings } from "./animation-config"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Base props for all scroll animations
interface BaseScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  start?: string
  end?: string
  markers?: boolean
  scrub?: boolean | number
  once?: boolean
}

// Fade in animation
export function GSAPFadeIn({
  children,
  className,
  delay = 0,
  duration = durations.slow,
  start = "top bottom-=100",
  end = "bottom top+=100",
  markers = false,
  scrub = false,
  once = true,
}: BaseScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Set initial state
    gsap.set(element, { autoAlpha: 0 })

    // Create animation
    const animation = gsap.to(element, {
      autoAlpha: 1,
      duration: scrub ? 0 : duration,
      delay: scrub ? 0 : delay,
      ease: easings.smooth,
      overwrite: "auto",
    })

    // Create ScrollTrigger
    triggerRef.current = ScrollTrigger.create({
      trigger: element,
      start: start,
      end: end,
      markers: markers,
      toggleActions: once ? "play none none none" : "play reverse play reverse",
      scrub: scrub,
      animation: animation,
    })

    return () => {
      // Clean up
      if (triggerRef.current) {
        triggerRef.current.kill()
      }
    }
  }, [delay, duration, start, end, markers, scrub, once])

  return (
    <div ref={ref} className={cn("opacity-0", className)}>
      {children}
    </div>
  )
}

// Slide in animation
export function GSAPSlideIn({
  children,
  className,
  delay = 0,
  duration = durations.slow,
  start = "top bottom-=100",
  end = "bottom top+=100",
  markers = false,
  scrub = false,
  once = true,
  direction = "up",
  distance = 100,
}: BaseScrollAnimationProps & {
  direction?: "up" | "down" | "left" | "right"
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Calculate initial position based on direction
    const initialX = direction === "left" ? -distance : direction === "right" ? distance : 0
    const initialY = direction === "up" ? distance : direction === "down" ? -distance : 0

    // Set initial state
    gsap.set(element, {
      x: initialX,
      y: initialY,
      autoAlpha: 0,
    })

    // Create animation
    const animation = gsap.to(element, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: scrub ? 0 : duration,
      delay: scrub ? 0 : delay,
      ease: easings.smooth,
      overwrite: "auto",
    })

    // Create ScrollTrigger
    triggerRef.current = ScrollTrigger.create({
      trigger: element,
      start: start,
      end: end,
      markers: markers,
      toggleActions: once ? "play none none none" : "play reverse play reverse",
      scrub: scrub,
      animation: animation,
    })

    return () => {
      // Clean up
      if (triggerRef.current) {
        triggerRef.current.kill()
      }
    }
  }, [delay, duration, start, end, markers, scrub, once, direction, distance])

  return (
    <div ref={ref} className={cn("opacity-0", className)}>
      {children}
    </div>
  )
}

// Scale in animation
export function GSAPScaleIn({
  children,
  className,
  delay = 0,
  duration = durations.slow,
  start = "top bottom-=100",
  end = "bottom top+=100",
  markers = false,
  scrub = false,
  once = true,
  from = 0.8,
}: BaseScrollAnimationProps & {
  from?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Set initial state
    gsap.set(element, {
      scale: from,
      autoAlpha: 0,
    })

    // Create animation
    const animation = gsap.to(element, {
      scale: 1,
      autoAlpha: 1,
      duration: scrub ? 0 : duration,
      delay: scrub ? 0 : delay,
      ease: easings.smooth,
      overwrite: "auto",
    })

    // Create ScrollTrigger
    triggerRef.current = ScrollTrigger.create({
      trigger: element,
      start: start,
      end: end,
      markers: markers,
      toggleActions: once ? "play none none none" : "play reverse play reverse",
      scrub: scrub,
      animation: animation,
    })

    return () => {
      // Clean up
      if (triggerRef.current) {
        triggerRef.current.kill()
      }
    }
  }, [delay, duration, start, end, markers, scrub, once, from])

  return (
    <div ref={ref} className={cn("opacity-0", className)}>
      {children}
    </div>
  )
}

// Staggered text reveal animation
export function GSAPTextReveal({
  text,
  className,
  delay = 0,
  duration = durations.slow,
  start = "top bottom-=100",
  end = "bottom top+=100",
  markers = false,
  scrub = false,
  once = true,
  stagger = 0.05,
}: BaseScrollAnimationProps & {
  text: string
  stagger?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const words = text.split(" ")

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Get all word elements
    const wordElements = container.querySelectorAll(".gsap-word")

    // Set initial state
    gsap.set(wordElements, {
      y: 30,
      autoAlpha: 0,
    })

    // Create animation
    const animation = gsap.to(wordElements, {
      y: 0,
      autoAlpha: 1,
      duration: scrub ? 0 : duration,
      delay: scrub ? 0 : delay,
      stagger: scrub ? 0 : stagger,
      ease: easings.textReveal, // Using textReveal as it's more specific
      overwrite: "auto",
    })

    // Create ScrollTrigger
    triggerRef.current = ScrollTrigger.create({
      trigger: container,
      start: start,
      end: end,
      markers: markers,
      toggleActions: once ? "play none none none" : "play reverse play reverse",
      scrub: scrub,
      animation: animation,
    })

    return () => {
      // Clean up
      if (triggerRef.current) {
        triggerRef.current.kill()
      }
    }
  }, [delay, duration, start, end, markers, scrub, once, stagger, words.length])

  return (
    <div ref={containerRef} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <div key={i} className="mr-[0.25em] overflow-hidden">
          <div className="gsap-word opacity-0">{word}</div>
        </div>
      ))}
    </div>
  )
}

// Parallax effect
export function GSAPParallax({
  children,
  className,
  speed = 0.5,
  start = "top bottom",
  end = "bottom top",
  markers = false,
}: {
  children: ReactNode
  className?: string
  speed?: number
  start?: string
  end?: string
  markers?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Create animation
    const animation = gsap.fromTo(
      element,
      {
        y: 0,
      },
      {
        y: () => -element.offsetHeight * speed,
        ease: "none",
      },
    )

    // Create ScrollTrigger
    triggerRef.current = ScrollTrigger.create({
      trigger: element.parentElement,
      start: start,
      end: end,
      markers: markers,
      scrub: true,
      animation: animation,
    })

    return () => {
      // Clean up
      if (triggerRef.current) {
        triggerRef.current.kill()
      }
    }
  }, [speed, start, end, markers])

  return (
    <div className={cn("overflow-hidden", className)}>
      <div ref={ref} className="will-change-transform">
        {children}
      </div>
    </div>
  )
}

// Horizontal scroll section
export function GSAPHorizontalScroll({
  children,
  className,
  start = "top top",
  end = "+=300%",
  markers = false,
  pin = true,
}: {
  children: ReactNode
  className?: string
  start?: string
  end?: string
  markers?: boolean
  pin?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Get all sections
    const sections = element.querySelectorAll(".gsap-horizontal-section")

    // Calculate total width
    let totalWidth = 0
    sections.forEach((section) => {
      totalWidth += (section as HTMLElement).offsetWidth
    })

    // Create animation
    const animation = gsap.to(sections, {
      x: () => -(totalWidth - window.innerWidth),
      ease: "none",
    })

    // Create ScrollTrigger
    triggerRef.current = ScrollTrigger.create({
      trigger: element,
      start: start,
      end: end,
      markers: markers,
      scrub: true,
      pin: pin,
      animation: animation,
    })

    return () => {
      // Clean up
      if (triggerRef.current) {
        triggerRef.current.kill()
      }
    }
  }, [start, end, markers, pin])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div className="flex">{children}</div>
    </div>
  )
}
