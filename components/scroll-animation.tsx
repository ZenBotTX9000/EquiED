"use client"

import type { ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale"
  delay?: 1 | 2 | 3 | 4 | 5
  once?: boolean
  className?: string
}

export default function ScrollAnimation({
  children,
  animation = "fade",
  delay,
  once = true,
  className = "",
}: ScrollAnimationProps) {
  return (
    <div
      data-animate="true"
      data-animation={animation}
      data-delay={delay}
      data-once={once ? "true" : "false"}
      className={className}
    >
      {children}
    </div>
  )
}
