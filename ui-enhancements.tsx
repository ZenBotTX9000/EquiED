"use client"

import type React from "react"

import { motion } from "framer-motion"
import { buttonHover, fadeIn, scaleUp, slideUp } from "@/lib/animations"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ReactNode } from "react"

// Enhanced button with animations
export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <motion.div {...buttonHover}>
      <Button
        className={cn("transition-all duration-300 shadow-sm hover:shadow-md", className)}
        variant={variant}
        size={size}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}

// Enhanced card with animations
export function AnimatedCard({
  children,
  className,
  variant = "fadeIn",
  ...props
}: React.ComponentProps<typeof Card> & {
  variant?: "fadeIn" | "scaleUp" | "slideUp"
}) {
  const animations = {
    fadeIn,
    scaleUp,
    slideUp,
  }

  return (
    <motion.div {...animations[variant]}>
      <Card className={cn("transition-all duration-300 hover:shadow-lg border-opacity-50", className)} {...props}>
        {children}
      </Card>
    </motion.div>
  )
}

// Animated section for page sections
export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// Animated list for staggered animations
export function AnimatedList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.ul
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.ul>
  )
}

// Animated list item
export function AnimatedListItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.li
      variants={{
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
      }}
      className={className}
    >
      {children}
    </motion.li>
  )
}

// Loading spinner with animation
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  }

  return (
    <motion.div
      className={cn("rounded-full border-t-transparent border-primary animate-spin", sizeClasses[size])}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  )
}

// Shimmer effect for loading states
export function Shimmer({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("bg-gradient-to-r from-transparent via-gray-200 to-transparent bg-[length:400%_100%]", className)}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
        duration: 1.5,
      }}
    />
  )
}

// Animated page transitions
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  )
}
