"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

// Text that reveals character by character
export function RevealText({
  text,
  className,
  delay = 0,
  duration = 0.5,
  staggerChildren = 0.02,
}: {
  text: string
  className?: string
  delay?: number
  duration?: number
  staggerChildren?: number
}) {
  const characters = text.split("")

  return (
    <motion.div
      className={cn("inline-block", className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration,
              },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Gradient text with animation
export function GradientText({
  children,
  className,
  from = "from-primary",
  to = "to-secondary",
  animate = true,
}: {
  children: ReactNode
  className?: string
  from?: string
  to?: string
  animate?: boolean
}) {
  return animate ? (
    <motion.span
      className={cn("bg-gradient-to-r bg-clip-text text-transparent", from, to, className)}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {children}
    </motion.span>
  ) : (
    <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", from, to, className)}>{children}</span>
  )
}

// Typewriter effect
export function TypewriterText({
  text,
  className,
  delay = 0,
  speed = 50,
}: {
  text: string
  className?: string
  delay?: number
  speed?: number
}) {
  const characters = text.split("")

  return (
    <motion.div className={cn("inline-block", className)} initial="hidden" animate="visible">
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: delay + index * (speed / 1000),
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Highlight text with animation
export function HighlightText({
  children,
  className,
  highlightClassName,
}: {
  children: ReactNode
  className?: string
  highlightClassName?: string
}) {
  return (
    <motion.span
      className={cn("relative inline-block", className)}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.span
        className={cn("absolute bottom-0 left-0 h-[30%] w-full -z-10 bg-primary/20", highlightClassName)}
        variants={{
          initial: { width: "0%" },
          animate: { width: "100%", transition: { duration: 0.5 } },
          hover: { height: "100%", transition: { duration: 0.2 } },
        }}
      />
      {children}
    </motion.span>
  )
}

// Animated counter
export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className,
  formatter = (value: number) => Math.round(value).toString(),
}: {
  from?: number
  to: number
  duration?: number
  className?: string
  formatter?: (value: number) => string
}) {
  return (
    <motion.span
      className={className}
      initial={{ count: from }}
      animate={{ count: to }}
      transition={{ duration, type: "spring", damping: 10 }}
    >
      {({ count }) => formatter(count)}
    </motion.span>
  )
}
