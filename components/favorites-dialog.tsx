"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, Star, Search, Trash2 } from "lucide-react"
import { useAnimationVariants, applyHardwareAcceleration, removeHardwareAcceleration } from "@/lib/animation-utils"

type FavoritesDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSelectFavorite: (content: string) => void
}

export default function FavoritesDialog({ isOpen, onClose, onSelectFavorite }: FavoritesDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<Array<{ id: string; content: string }>>([])
  const prefersReducedMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get optimized animation variants
  const animations = useAnimationVariants({
    reduced: { duration: 0.15 },
    full: {
      duration: 0.3,
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  })

  // Apply hardware acceleration when dialog opens
  useEffect(() => {
    if (isOpen) {
      applyHardwareAcceleration(dialogRef.current)

      // Focus input after animation completes
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)

      return () => clearTimeout(timer)
    } else {
      removeHardwareAcceleration(dialogRef.current)
    }
  }, [isOpen])

  // Load favorites from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const storedFavorites = localStorage.getItem("chatFavorites")
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites))
        }
      } catch (error) {
        console.error("Error parsing favorites:", error)
      }
    }
  }, [isOpen])

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
    }
  }, [isOpen])

  const filteredFavorites = favorites.filter((fav) => fav.content.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleRemoveFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedFavorites = favorites.filter((fav) => fav.id !== id)
    setFavorites(updatedFavorites)
    localStorage.setItem("chatFavorites", JSON.stringify(updatedFavorites))
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={animations.fadeIn.transition} // Use the whole transition object from the hook
            data-testid="favorites-dialog-overlay"
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
              data-testid="favorites-dialog"
            >
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    <Star className="h-5 w-5 text-[#700936]" />
                    <h3 className="text-lg font-semibold text-white">Favorites</h3>
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
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                >
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search favorites..."
                    className="w-full bg-slate-700/50 border border-slate-600/30 rounded-md py-2 pl-10 pr-4 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#700936] transition-all"
                  />
                </motion.div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                {filteredFavorites.length === 0 ? (
                  <motion.div
                    className="p-6 text-center text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    {searchTerm ? "No matching favorites found" : "No favorites yet"}
                    <p className="text-sm mt-2">
                      {searchTerm ? "Try a different search term" : "Star messages in the chat to save them here"}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="p-2"
                    variants={{ // Define variants locally for clarity and type safety
                      initial: animations.staggerContainer.initial,
                      animate: {
                        ...(animations.staggerContainer.animate || {}), // Spread animate props like opacity
                        transition: animations.staggerContainer.transition, // Add stagger transition here
                      },
                      exit: animations.staggerContainer.exit,
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {filteredFavorites.map((favorite, index) => (
                      <motion.div
                        key={favorite.id}
                        initial={{ opacity: 0, y: prefersReducedMotion ? 5 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: prefersReducedMotion ? -5 : -10 }}
                        transition={{ duration: prefersReducedMotion ? 0.15 : 0.3, ease: "easeOut" }}
                        className="group relative p-3 border border-slate-700/50 rounded-md mb-2 bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                        whileHover={{ x: 3, backgroundColor: "rgba(51, 65, 85, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className="text-sm text-slate-300 line-clamp-3 cursor-pointer"
                          onClick={() => onSelectFavorite(favorite.content)}
                        >
                          {favorite.content}
                        </div>
                        <motion.button
                          onClick={(e) => handleRemoveFavorite(favorite.id, e)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-slate-700/70 text-slate-400 hover:text-red-400 hover:bg-slate-600/70 opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Remove from favorites"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              <motion.div
                className="p-4 border-t border-slate-700/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                <button
                  onClick={onClose}
                  className="w-full p-2 bg-gradient-to-r from-[#700936] to-[#9c1c4e] text-white rounded-md hover:from-[#9c1c4e] hover:to-[#700936] transition-all shadow-md"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
