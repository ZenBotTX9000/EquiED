"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { type ReactNode, useState, useEffect } from "react"
import { CheckIcon, XIcon, AlertCircleIcon } from "lucide-react"

// Success feedback
export function SuccessFeedback({
  show,
  message,
  duration = 3000,
  onComplete,
  className,
}: {
  show: boolean
  message: string
  duration?: number
  onComplete?: () => void
  className?: string
}) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md",
            className,
          )}
        >
          <CheckIcon className="h-5 w-5" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Error feedback
export function ErrorFeedback({
  show,
  message,
  duration = 3000,
  onComplete,
  className,
}: {
  show: boolean
  message: string
  duration?: number
  onComplete?: () => void
  className?: string
}) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-md shadow-md",
            className,
          )}
        >
          <XIcon className="h-5 w-5" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Info feedback
export function InfoFeedback({
  show,
  message,
  duration = 3000,
  onComplete,
  className,
}: {
  show: boolean
  message: string
  duration?: number
  onComplete?: () => void
  className?: string
}) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-md shadow-md",
            className,
          )}
        >
          <AlertCircleIcon className="h-5 w-5" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Animated button feedback
export function ButtonFeedback({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick: () => void
  className?: string
}) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    onClick()
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <motion.button
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <AnimatePresence>
        {isAnimating && (
          <motion.span
            className="absolute inset-0 bg-white/30 rounded-full"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Animated input feedback
export function InputFeedback({
  children,
  isValid,
  isInvalid,
  className,
}: {
  children: ReactNode
  isValid?: boolean
  isInvalid?: boolean
  className?: string
}) {
  return (
    <motion.div
      className={cn("relative", className)}
      animate={
        isValid
          ? { x: [0, -2, 2, -2, 2, 0], borderColor: "rgb(34, 197, 94)" }
          : isInvalid
            ? { x: [0, -2, 2, -2, 2, 0], borderColor: "rgb(239, 68, 68)" }
            : {}
      }
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
