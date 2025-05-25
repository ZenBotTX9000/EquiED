"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Command, Calculator, Info, HelpCircle, DollarSign, Briefcase, BarChart3, X, AlertTriangle } from "lucide-react"
import { useAnimationVariants, applyHardwareAcceleration, removeHardwareAcceleration } from "@/lib/animation-utils"

type CommandPaletteProps = {
  isOpen: boolean
  onClose: () => void
  onShowCalculator: () => void
  onShowFact: (factType: string) => void
}

export default function CommandPalette({ isOpen, onClose, onShowCalculator, onShowFact }: CommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

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

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  const commands = [
    {
      id: "calculator",
      name: "Salary Calculator",
      description: "Open the salary calculator tool",
      icon: <Calculator className="h-5 w-5 text-[#700936]" />,
      action: () => {
        onShowCalculator()
        onClose()
      },
    },
    {
      id: "salary",
      name: "Salary Information",
      description: "Learn about the South African salary calculation",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      action: () => {
        onShowFact("salary")
        onClose()
      },
    },
    {
      id: "debt",
      name: "National Debt",
      description: "How long would it take to clear South Africa's national debt?",
      icon: <BarChart3 className="h-5 w-5 text-red-500" />,
      action: () => {
        onShowFact("debt")
        onClose()
      },
    },
    {
      id: "free",
      name: "Free Products",
      description: "How do products become free in the Equidistributed Salary model?",
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
      action: () => {
        onShowFact("free")
        onClose()
      },
    },
    {
      id: "enterprise",
      name: "Enterprise Contribution",
      description: "Explain the Enterprise Contribution concept",
      icon: <Briefcase className="h-5 w-5 text-yellow-500" />,
      action: () => {
        onShowFact("enterprise")
        onClose()
      },
    },
    {
      id: "distribution",
      name: "Continuous Redistribution",
      description: "How does the continuous redistribution work?",
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
      action: () => {
        onShowFact("distribution")
        onClose()
      },
    },
    {
      id: "model",
      name: "Model Information",
      description: "Show information about the AI model being used",
      icon: <Info className="h-5 w-5 text-blue-400" />,
      action: () => {
        onShowFact("model")
        onClose()
      },
    },
    {
      id: "help",
      name: "Help",
      description: "What can the chatbot help with?",
      icon: <HelpCircle className="h-5 w-5 text-teal-500" />,
      action: () => {
        onShowFact("help")
        onClose()
      },
    },
    {
      id: "country-concerns",
      name: "Discuss Country Concerns",
      description: "Share your concerns about your country's current system",
      icon: <AlertTriangle className="h-4 w-4" />,
      action: () => {
        onShowFact(
          "What is it about South Africa or your country that is currently your issue or concern about the system?",
        )
        onClose()
      },
    },
  ]

  const filteredCommands = commands.filter(
    (command) =>
      command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredCommands.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredCommands.length) % filteredCommands.length)
        break
      case "Enter":
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
        }
        break
      case "Escape":
        e.preventDefault()
        onClose()
        break
    }
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
            data-testid="command-palette-overlay"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh] pointer-events-none">
            <motion.div
              ref={dialogRef}
              className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
                mass: 1,
              }}
              data-testid="command-palette"
            >
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Command className="h-5 w-5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setSelectedIndex(0)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search commands..."
                    className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 text-sm"
                    autoComplete="off"
                  />
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                {filteredCommands.length === 0 ? (
                  <motion.div
                    className="p-4 text-center text-slate-400 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    No commands found
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
                    {filteredCommands.map((command, index) => (
                      <motion.div
                        key={command.id}
                        initial={{ opacity: 0, y: prefersReducedMotion ? 5 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: prefersReducedMotion ? -5 : -10 }}
                        transition={{ duration: prefersReducedMotion ? 0.15 : 0.3, ease: "easeOut" }}
                        onClick={() => command.action()}
                        className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedIndex === index
                            ? "bg-slate-700/70 text-white"
                            : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                        }`}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex-shrink-0">{command.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{command.name}</div>
                          <div className="text-xs text-slate-400 truncate">{command.description}</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              <motion.div
                className="p-2 border-t border-slate-700/50 text-xs text-slate-400 flex justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">↑↓</span>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">Enter</span>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">Esc</span>
                  <span>Close</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
