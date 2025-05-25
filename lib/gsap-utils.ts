"use client"

import { gsap } from "gsap"

// Initialize GSAP with optimal settings
export function initGSAP() {
  // Set default ease
  gsap.defaults({
    ease: "power2.out",
  })

  // Optimize GSAP for performance
  gsap.ticker.lagSmoothing(0) // Disable lag smoothing for more accurate animations

  // Set force3D for better performance
  gsap.config({
    force3D: true,
  })
}

// Animate element entrance
export function animateEntrance(
  element: HTMLElement,
  options: {
    delay?: number
    duration?: number
    y?: number
    x?: number
    opacity?: number
    scale?: number
    ease?: string
  } = {},
) {
  const { delay = 0, duration = 0.6, y = 20, x = 0, opacity = 0, scale = 1, ease = "power2.out" } = options

  // Set initial state
  gsap.set(element, {
    y,
    x,
    opacity,
    scale,
  })

  // Animate to final state
  return gsap.to(element, {
    y: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    duration,
    delay,
    ease,
  })
}

// Animate element exit
export function animateExit(
  element: HTMLElement,
  options: {
    delay?: number
    duration?: number
    y?: number
    x?: number
    opacity?: number
    scale?: number
    ease?: string
    onComplete?: () => void
  } = {},
) {
  const {
    delay = 0,
    duration = 0.4,
    y = -20,
    x = 0,
    opacity = 0,
    scale = 0.95,
    ease = "power2.in",
    onComplete,
  } = options

  // Animate to exit state
  return gsap.to(element, {
    y,
    x,
    opacity,
    scale,
    duration,
    delay,
    ease,
    onComplete,
  })
}

// Staggered animation for multiple elements
export function animateStaggered(
  elements: HTMLElement[] | NodeListOf<Element>,
  options: {
    delay?: number
    duration?: number
    stagger?: number
    y?: number
    x?: number
    opacity?: number
    scale?: number
    ease?: string
  } = {},
) {
  const {
    delay = 0,
    duration = 0.6,
    stagger = 0.05,
    y = 20,
    x = 0,
    opacity = 0,
    scale = 1,
    ease = "power2.out",
  } = options

  // Set initial state
  gsap.set(elements, {
    y,
    x,
    opacity,
    scale,
  })

  // Animate to final state with stagger
  return gsap.to(elements, {
    y: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    duration,
    delay,
    stagger,
    ease,
  })
}

// Create a reveal text animation
export function animateTextReveal(
  element: HTMLElement,
  options: {
    delay?: number
    duration?: number
    stagger?: number
    ease?: string
  } = {},
) {
  const { delay = 0, duration = 0.6, stagger = 0.02, ease = "power2.out" } = options

  // Split text into words
  const text = element.textContent || ""
  element.textContent = ""

  const words = text.split(" ")

  // Create word spans
  words.forEach((word, i) => {
    const wordSpan = document.createElement("span")
    wordSpan.className = "inline-block overflow-hidden mr-[0.25em]"

    const innerSpan = document.createElement("span")
    innerSpan.className = "inline-block transform translate-y-full opacity-0"
    innerSpan.textContent = word

    wordSpan.appendChild(innerSpan)
    element.appendChild(wordSpan)
  })

  // Animate words
  const innerSpans = element.querySelectorAll("span > span")

  return gsap.to(innerSpans, {
    y: 0,
    opacity: 1,
    duration,
    delay,
    stagger,
    ease,
  })
}
