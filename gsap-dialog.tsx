"use client"

import type React from "react"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface GSAPDialogProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  overlayClassName?: string
  contentClassName?: string
  duration?: number
  closeOnOverlayClick?: boolean
}

export default function GSAPDialog({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  contentClassName,
  duration = 0.3,
  closeOnOverlayClick = true,
}: GSAPDialogProps) {
  const [isVisible, setIsVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  // Handle animation
  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return

    // Create timeline if it doesn't exist
    if (!timelineRef.current) {
      timelineRef.current = gsap
        .timeline({ paused: true })
        .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: duration * 0.8, ease: "power2.out" })
        .fromTo(
          contentRef.current,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration, ease: "power3.out" },
          "-=0.2", // Start slightly before overlay animation completes
        )
    }

    // Play or reverse timeline based on isOpen
    if (isOpen) {
      setIsVisible(true)
      timelineRef.current.play()
    } else if (isVisible) {
      timelineRef.current.reverse().then(() => {
        setIsVisible(false)
      })
    }

    // Clean up
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
    }
  }, [isOpen, duration])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isVisible && !isOpen) return null

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        overlayClassName,
      )}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={contentRef}
        className={cn(
          "relative z-50 max-h-[85vh] w-[90vw] max-w-md overflow-auto rounded-lg bg-slate-900 p-6 shadow-xl",
          contentClassName,
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  )
}
