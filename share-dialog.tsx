"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, Share2, Copy, Check, Twitter, Facebook } from "lucide-react"
import { useAnimationVariants, applyHardwareAcceleration, removeHardwareAcceleration } from "@/lib/animation-utils"

export default function ShareDialog({
  isOpen,
  onClose,
  content,
}: {
  isOpen: boolean
  onClose: () => void
  content: string
}) {
  const [copied, setCopied] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)

  // Get optimized animation variants
  const animations = useAnimationVariants({
    reduced: { duration: 0.15 },
    full: { duration: 0.3 },
  })

  // Apply hardware acceleration when dialog opens
  useEffect(() => {
    if (isOpen) {
      applyHardwareAcceleration(dialogRef.current)
    } else {
      removeHardwareAcceleration(dialogRef.current)
    }
  }, [isOpen])

  // Reset copied state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false)
    }
  }, [isOpen])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(content.substring(0, 280))
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={onClose}
            {...animations.fadeIn}
            data-testid="share-dialog-overlay"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={dialogRef}
              className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
                mass: 1,
              }}
              data-testid="share-dialog"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    <motion.div
                      whileHover={prefersReducedMotion ? {} : { rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Share2 className="h-5 w-5 text-[#700936]" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">Share</h3>
                  </motion.div>
                  <motion.button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50"
                    whileHover={prefersReducedMotion ? {} : { rotate: 90, scale: 1.1 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <motion.div
                  className="mb-5"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                >
                  <div className="bg-slate-700/80 p-4 rounded-lg max-h-60 overflow-y-auto text-white text-sm shadow-inner backdrop-blur-sm border border-slate-600/30 scrollbar-thin">
                    {content}
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-3 gap-3 mb-5"
                  variants={animations.staggerContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.button
                    onClick={handleCopy}
                    className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-slate-700/90 to-slate-800/90 rounded-lg hover:from-slate-600/90 hover:to-slate-700/90 transition-colors shadow-md"
                    variants={animations.staggerItem}
                    whileHover={prefersReducedMotion ? {} : { y: -5, scale: 1.03 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                  >
                    {copied ? (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <Check className="h-5 w-5 text-green-500" />
                      </motion.div>
                    ) : (
                      <Copy className="h-5 w-5 text-white" />
                    )}
                    <span className="text-xs text-white">{copied ? "Copied!" : "Copy"}</span>
                  </motion.button>
                  <motion.button
                    onClick={shareOnTwitter}
                    className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-slate-700/90 to-slate-800/90 rounded-lg hover:from-slate-600/90 hover:to-slate-700/90 transition-colors shadow-md"
                    variants={animations.staggerItem}
                    whileHover={prefersReducedMotion ? {} : { y: -5, scale: 1.03 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                  >
                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                    <span className="text-xs text-white">Twitter</span>
                  </motion.button>
                  <motion.button
                    onClick={shareOnFacebook}
                    className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-slate-700/90 to-slate-800/90 rounded-lg hover:from-slate-600/90 hover:to-slate-700/90 transition-colors shadow-md"
                    variants={animations.staggerItem}
                    whileHover={prefersReducedMotion ? {} : { y: -5, scale: 1.03 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                  >
                    <Facebook className="h-5 w-5 text-[#4267B2]" />
                    <span className="text-xs text-white">Facebook</span>
                  </motion.button>
                </motion.div>

                <motion.button
                  onClick={onClose}
                  className="w-full p-3 bg-gradient-to-r from-[#700936] to-[#9c1c4e] text-white rounded-lg hover:from-[#9c1c4e] hover:to-[#700936] transition-all shadow-lg"
                  whileHover={
                    prefersReducedMotion ? {} : { scale: 1.02, boxShadow: "0 5px 15px rgba(112, 9, 54, 0.4)" }
                  }
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.25 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
