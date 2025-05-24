"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { type ReactNode, useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Enhanced Fade in on scroll with proper enter/exit animations
export function FadeInOnScroll({
  children,
  className,
  threshold = 0.1,
  duration = 0.5,
  delay = 0,
  exitDuration = 0.3,
}: {
  children: ReactNode
  className?: string
  threshold?: number
  duration?: number
  delay?: number
  exitDuration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    amount: threshold,
    once: false, // Important: set to false to trigger exit animations
  })

  // Track if element has ever been in view to handle initial animation
  const [hasBeenInView, setHasBeenInView] = useState(false)

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true)
    }
  }, [isInView, hasBeenInView])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        {isInView ? (
          <motion.div
            key="visible"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration,
                delay: hasBeenInView ? 0 : delay,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: exitDuration,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            className="will-change-opacity"
          >
            {children}
          </motion.div>
        ) : (
          hasBeenInView && (
            <motion.div
              key="hidden"
              initial={{ opacity: 1 }}
              animate={{
                opacity: 0,
                transition: {
                  duration: exitDuration,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="will-change-opacity"
            >
              {children}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Slide in from side on scroll with proper enter/exit animations
export function SlideInOnScroll({
  children,
  className,
  direction = "left",
  distance = 50,
  threshold = 0.1,
  duration = 0.6,
  delay = 0,
  exitDuration = 0.4,
}: {
  children: ReactNode
  className?: string
  direction?: "left" | "right" | "top" | "bottom"
  distance?: number
  threshold?: number
  duration?: number
  delay?: number
  exitDuration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    amount: threshold,
    once: false,
  })

  const [hasBeenInView, setHasBeenInView] = useState(false)

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true)
    }
  }, [isInView, hasBeenInView])

  const directionMap = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    top: { x: 0, y: -distance },
    bottom: { x: 0, y: distance },
  }

  const exitDirectionMap = {
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    top: { x: 0, y: distance },
    bottom: { x: 0, y: -distance },
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        {isInView ? (
          <motion.div
            key="visible"
            initial={{
              opacity: 0,
              x: directionMap[direction].x,
              y: directionMap[direction].y,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              transition: {
                duration,
                delay: hasBeenInView ? 0 : delay,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              x: exitDirectionMap[direction].x,
              y: exitDirectionMap[direction].y,
              transition: {
                duration: exitDuration,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            className="will-change-transform will-change-opacity"
          >
            {children}
          </motion.div>
        ) : (
          hasBeenInView && (
            <motion.div
              key="hidden"
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: 0,
                x: exitDirectionMap[direction].x,
                y: exitDirectionMap[direction].y,
                transition: {
                  duration: exitDuration,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="will-change-transform will-change-opacity"
            >
              {children}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Scale in on scroll with proper enter/exit animations
export function ScaleInOnScroll({
  children,
  className,
  threshold = 0.1,
  duration = 0.6,
  delay = 0,
  exitDuration = 0.4,
  startScale = 0.9,
  exitScale = 0.95,
}: {
  children: ReactNode
  className?: string
  threshold?: number
  duration?: number
  delay?: number
  exitDuration?: number
  startScale?: number
  exitScale?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    amount: threshold,
    once: false,
  })

  const [hasBeenInView, setHasBeenInView] = useState(false)

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true)
    }
  }, [isInView, hasBeenInView])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        {isInView ? (
          <motion.div
            key="visible"
            initial={{ opacity: 0, scale: startScale }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration,
                delay: hasBeenInView ? 0 : delay,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              scale: exitScale,
              transition: {
                duration: exitDuration,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            className="will-change-transform will-change-opacity"
          >
            {children}
          </motion.div>
        ) : (
          hasBeenInView && (
            <motion.div
              key="hidden"
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: exitScale,
                transition: {
                  duration: exitDuration,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="will-change-transform will-change-opacity"
            >
              {children}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Parallax effect on scroll
export function ParallaxOnScroll({
  children,
  className,
  speed = 0.5,
  threshold = 0.1,
}: {
  children: ReactNode
  className?: string
  speed?: number
  threshold?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

// Enhanced Reveal text on scroll with proper enter/exit animations
export function RevealTextOnScroll({
  text,
  className,
  threshold = 0.1,
  duration = 0.5,
  staggerChildren = 0.03,
  exitDuration = 0.3,
}: {
  text: string
  className?: string
  threshold?: number
  duration?: number
  staggerChildren?: number
  exitDuration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    amount: threshold,
    once: false,
  })

  const [hasBeenInView, setHasBeenInView] = useState(false)

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true)
    }
  }, [isInView, hasBeenInView])

  const words = text.split(" ")

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        {isInView ? (
          <motion.div
            key="visible"
            className="flex flex-wrap"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren,
                },
              },
              exit: {
                transition: {
                  staggerChildren: staggerChildren / 2,
                  staggerDirection: -1,
                },
              },
            }}
          >
            {words.map((word, i) => (
              <div key={i} className="mr-[0.25em] overflow-hidden">
                <motion.div
                  variants={{
                    hidden: { y: 40, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        duration,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                    exit: {
                      y: -20,
                      opacity: 0,
                      transition: {
                        duration: exitDuration,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                  className="will-change-transform will-change-opacity"
                >
                  {word}
                </motion.div>
              </div>
            ))}
          </motion.div>
        ) : (
          hasBeenInView && (
            <motion.div
              key="hidden"
              className="flex flex-wrap"
              initial="visible"
              animate="exit"
              variants={{
                visible: {},
                exit: {
                  transition: {
                    staggerChildren: staggerChildren / 2,
                    staggerDirection: -1,
                  },
                },
              }}
            >
              {words.map((word, i) => (
                <div key={i} className="mr-[0.25em] overflow-hidden">
                  <motion.div
                    variants={{
                      visible: {
                        y: 0,
                        opacity: 1,
                      },
                      exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                          duration: exitDuration,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      },
                    }}
                    className="will-change-transform will-change-opacity"
                  >
                    {word}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

// New component: Smooth Scroll Viewport
export function SmoothScrollViewport({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Apply smooth scrolling effect
  useEffect(() => {
    if (!ref.current) return

    // Check if device supports smooth scrolling
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Apply smooth scrolling class
    ref.current.classList.add("smooth-scroll")

    return () => {
      if (ref.current) {
        ref.current.classList.remove("smooth-scroll")
      }
    }
  }, [])

  return (
    <div ref={ref} className={cn("relative", className)}>
      {children}
    </div>
  )
}
