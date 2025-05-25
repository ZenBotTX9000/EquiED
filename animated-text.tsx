"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion" // Added useMotionValue, useTransform, animate
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { useEffect } from "react"; // Ensured useEffect is imported

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
        className={cn("absolute bottom-0 left-0 h-[30%] w-full -z-10 bg-primary/20 origin-left", highlightClassName)} // Added origin-left
        variants={{
          initial: { scaleX: 0 }, // Changed width to scaleX
          animate: { scaleX: 1, transition: { duration: 0.5 } }, // Changed width to scaleX
          hover: { scaleY: 3.33, transition: { duration: 0.2 } }, // Changed height to scaleY (30% * 3.33 ~= 100%)
        }}
      />
      {children}
    </motion.span>
  )
}

// Removed duplicate Framer Motion import here

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
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => formatter(latest));

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      type: "spring",
      damping: 10, // Or other transition props as needed
    });
    return controls.stop;
  }, [from, to, duration, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
