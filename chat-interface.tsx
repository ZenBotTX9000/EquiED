"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, useMemo, memo, Suspense } from "react"
import { Send, Bot, Sparkles, ArrowDown, AlertCircle, RefreshCw, Star, Command, HelpCircle } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useWindowSize } from "@/hooks/use-mobile"

// Import static components directly
import ChatMessage from "./chat-message"
import IntroScreen from "./intro-screen"
import QuickFacts from "./quick-facts"

// Import animation config
import { presets, easings, durations, adjustForDevice } from "@/lib/animation-config"
import { getOptimizationLevel, startFrameRateMonitoring, stopFrameRateMonitoring } from "@/lib/performance-monitor"

// Dynamically import heavy components
const SalaryCalculator = dynamic(() => import("./salary-calculator"), {
  ssr: false,
  loading: () => (
    <div className="p-4 bg-slate-800/50 rounded-lg animate-pulse">
      <div className="h-8 w-48 bg-slate-700/50 rounded mb-4"></div>
      <div className="h-4 w-full bg-slate-700/50 rounded mb-2"></div>
      <div className="h-4 w-3/4 bg-slate-700/50 rounded mb-4"></div>
      <div className="h-10 w-full bg-slate-700/50 rounded"></div>
    </div>
  ),
})

const CommandPalette = dynamic(() => import("./command-palette"), { ssr: false })
const ShareDialog = dynamic(() => import("./share-dialog"), { ssr: false })
const FavoritesDialog = dynamic(() => import("./favorites-dialog"), { ssr: false })

// Import GSAP
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { TextPlugin } from "gsap/TextPlugin"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin)
}

// Define the Message type
export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  source?: string
}

// Memoize the ChatMessage component to prevent unnecessary re-renders
const MemoizedChatMessage = memo(ChatMessage)

// Update the ChatInterface component to include favorites functionality
export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showCalculator, setShowCalculator] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryMessage, setRetryMessage] = useState<Message | null>(null)
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  // Add new state variables for favorites and sharing
  const [favorites, setFavorites] = useState<Message[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [shareContent, setShareContent] = useState("")
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [modelInfo, setModelInfo] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const messagesRef = useRef<HTMLDivElement>(null)
  const [optimizationLevel, setOptimizationLevel] = useState("full")
  const [currentFps, setCurrentFps] = useState<number | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [showConcernsPrompt, setShowConcernsPrompt] = useState(false)

  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion()

  // Get window size for responsive optimizations
  const { isMobile } = useWindowSize()

  // Determine device type for animation adjustments
  const deviceType = useMemo(() => {
    if (prefersReducedMotion) return "lowPower"
    if (isMobile) return "mobile"
    return "desktop"
  }, [prefersReducedMotion, isMobile])

  const scrollToBottom = useCallback(() => {
    // Only scroll to bottom if we're not showing the intro screen
    if (!showIntro && chatContainerRef.current) {
      // Use GSAP for smooth scrolling
      gsap.to(chatContainerRef.current, {
        scrollTop: chatContainerRef.current.scrollHeight,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          // Subtle pulse animation for the latest message
          const latestMessage = document.querySelector(".chat-message:last-child")
          if (latestMessage) {
            gsap.fromTo(
              latestMessage,
              { backgroundColor: "rgba(112, 9, 54, 0.05)" },
              {
                backgroundColor: "rgba(0, 0, 0, 0)",
                duration: 1,
                ease: "power2.out",
              },
            )
          }
        },
      })
    }
  }, [showIntro])

  // Initialize GSAP animations with refined configuration
  useGSAP(() => {
    if (showIntro || !chatContainerRef.current) return

    // Set up smooth scrolling for chat container
    gsap.set(chatContainerRef.current, {
      scrollBehavior: "smooth",
    })

    // Create a reusable timeline for message animations
    if (!timelineRef.current) {
      timelineRef.current = gsap.timeline({
        paused: true,
        defaults: {
          ease: easings.smooth,
          duration: durations.normal,
        },
      })
    }

    // Animate new messages with staggered timing
    const messageElements = document.querySelectorAll(".chat-message:not(.gsap-animated)")

    if (messageElements.length > 0) {
      // Clear existing animations
      if (timelineRef.current) {
        timelineRef.current.clear()
      }

      // Create new animations
      messageElements.forEach((element, index) => {
        // Mark as animated to prevent re-animation
        element.classList.add("gsap-animated")

        // Adjust animation based on device capabilities
        const messageAnimation = adjustForDevice(presets.messageIn, deviceType as any)

        // Add to timeline with staggered delay
        timelineRef.current?.to(
          element,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: messageAnimation.duration,
            ease: messageAnimation.ease,
            delay: messageAnimation.stagger ? index * messageAnimation.stagger : 0,
          },
          index * 0.08,
        )

        // Set up scroll trigger for each message
        ScrollTrigger.create({
          trigger: element,
          start: "top bottom-=100",
          end: "bottom top+=100",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(element, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            })
          },
          onLeave: () => {
            gsap.to(element, {
              opacity: 0.5,
              y: -20,
              scale: 0.98,
              duration: 0.3,
              ease: "power2.in",
            })
          },
          onEnterBack: () => {
            gsap.to(element, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            })
          },
          onLeaveBack: () => {
            gsap.to(element, {
              opacity: 0.5,
              y: 20,
              scale: 0.98,
              duration: 0.3,
              ease: "power2.in",
            })
          },
        })
      })

      // Play the timeline
      timelineRef.current?.play(0)
    }

    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [messages, showIntro, deviceType])

  // Start performance monitoring in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      startFrameRateMonitoring((fps) => {
        setCurrentFps(fps)
      })

      // Detect optimal settings based on device capabilities
      const level = getOptimizationLevel()
      setOptimizationLevel(level)
    }

    return () => {
      if (process.env.NODE_ENV === "development") {
        stopFrameRateMonitoring()
      }
    }
  }, [])

  // Ensure page loads at the top on mount and refresh - simplified
  useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo(0, 0)

    // Also reset scroll position of chat container
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0
    }

    // Mark initial load as complete after a short delay
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Load favorites from localStorage on mount - with error handling
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("chatFavorites")
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      // Fallback to empty array on error
      setFavorites([])
    }
  }, [])

  // Show concerns prompt after welcome message
  useEffect(() => {
    if (!showIntro && messages.length > 0 && !showConcernsPrompt) {
      const timer = setTimeout(() => {
        setShowConcernsPrompt(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showIntro, messages.length, showConcernsPrompt])

  // Memoize functions to prevent unnecessary re-renders
  const handleToggleFavorite = useCallback(
    (message: Message) => {
      try {
        const isFavorited = favorites.some((fav) => fav.id === message.id)

        if (isFavorited) {
          // Remove from favorites
          const updatedFavorites = favorites.filter((fav) => fav.id !== message.id)
          setFavorites(updatedFavorites)
          localStorage.setItem("chatFavorites", JSON.stringify(updatedFavorites))
        } else {
          // Add to favorites
          const updatedFavorites = [...favorites, message]
          setFavorites(updatedFavorites)
          localStorage.setItem("chatFavorites", JSON.stringify(updatedFavorites))
        }

        // Add animation feedback
        const button = document.querySelector(`[data-message-id="${message.id}"] .favorite-button`)
        if (button) {
          gsap.fromTo(
            button,
            { scale: 1 },
            {
              scale: 1.2,
              duration: 0.2,
              ease: "back.out(1.5)",
              yoyo: true,
              repeat: 1,
            },
          )
        }
      } catch (error) {
        console.error("Error updating favorites:", error)
      }
    },
    [favorites],
  )

  // Add function to handle sharing
  const handleShare = useCallback((message: Message) => {
    setShareContent(message.content)
    setShowShareDialog(true)

    // Add animation feedback
    const button = document.querySelector(`[data-message-id="${message.id}"] .share-button`)
    if (button) {
      gsap.fromTo(
        button,
        { scale: 1, rotation: 0 },
        {
          scale: 1.2,
          rotation: 15,
          duration: 0.3,
          ease: "back.out(1.5)",
          yoyo: true,
          repeat: 1,
        },
      )
    }
  }, [])

  // Add function to check if a message is favorited
  const isMessageFavorited = useCallback(
    (messageId: string) => {
      return favorites.some((fav) => fav.id === messageId)
    },
    [favorites],
  )

  // Add function to handle selecting a favorite
  const handleSelectFavorite = useCallback((content: string) => {
    setInput(content)
    setShowFavorites(false)
    inputRef.current?.focus()

    // Animate the input field to show it received the content
    if (inputRef.current) {
      gsap.fromTo(
        inputRef.current,
        { borderColor: "rgba(112, 9, 54, 0.8)", boxShadow: "0 0 0 2px rgba(112, 9, 54, 0.4)" },
        {
          borderColor: "rgba(112, 9, 54, 0)",
          boxShadow: "0 0 0 0px rgba(112, 9, 54, 0)",
          duration: 1,
          ease: "power2.out",
        },
      )
    }
  }, [])

  // Handle special commands
  const handleSpecialCommands = useCallback(
    (text: string): boolean => {
      const lowerText = text.toLowerCase().trim()

      if (lowerText === "/calculator" || lowerText === "/calc") {
        setShowCalculator(true)
        return true
      }

      if (lowerText === "/debug") {
        const debugMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `**Debug Information**

- Total messages: ${messages.length}
- Browser: ${navigator.userAgent}
- Window size: ${window.innerWidth}x${window.innerHeight}
- Time: ${new Date().toISOString()}
- Current model: ${modelInfo || "Unknown"}
- Optimization level: ${optimizationLevel}
- Current FPS: ${currentFps || "Unknown"}

If you're experiencing issues, please try:
1. Refreshing the page
2. Using the Quick Facts feature
3. Checking your internet connection`,
          source: "local",
        }
        setMessages((prev) => [...prev, debugMessage])
        return true
      }

      // Update the model info command to show the correct models
      if (lowerText === "/model" || lowerText === "/info") {
        const modelMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `**Current Model Information**

- Primary model: Google Gemini 2.0 Flash (free tier)
- Fallback model: Meta Llama 4 Maverick (free tier)
- Last response from: ${modelInfo || "No responses yet"}

All models are accessed via OpenRouter's API.`,
          source: "local",
        }
        setMessages((prev) => [...prev, modelMessage])
        return true
      }

      if (lowerText === "/favorites" || lowerText === "/saved") {
        setShowFavorites(true)
        return true
      }

      if (lowerText === "/clear" || lowerText === "/reset") {
        setMessages([])
        setWelcomeMessageShown(false)
        setShowConcernsPrompt(false)
        return true
      }

      if (lowerText === "/optimize") {
        // Toggle optimization level
        const newLevel = optimizationLevel === "full" ? "reduced" : "full"
        setOptimizationLevel(newLevel)

        const optimizeMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `**Optimization Level Changed**

Animation and performance settings have been changed to: **${newLevel}**

This affects animation quality and performance throughout the app.`,
          source: "local",
        }
        setMessages((prev) => [...prev, optimizeMessage])
        return true
      }

      if (lowerText === "/concerns") {
        setShowConcernsPrompt(true)
        return true
      }

      return false
    },
    [messages, modelInfo, optimizationLevel, currentFps],
  )

  // Show a welcome message when the component mounts
  useEffect(() => {
    if (!welcomeMessageShown && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: `Sawubona! Molo! Hallo! Hello! Dumela! 

I'm EquiED, your Equidistributed Salary Aide. I can communicate in all South African languages, so feel free to ask questions in the language you're most comfortable with.

What would you like to know about the National Equidistributed Salary model?`,
        source: "local",
      }
      setMessages([welcomeMessage])
      setWelcomeMessageShown(true)
    }
  }, [welcomeMessageShown, messages.length])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      // Clear any previous error
      setErrorMessage(null)
      setRetryMessage(null)

      // Check for special commands
      if (handleSpecialCommands(input)) {
        setInput("")
        return
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input.trim(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)
      setShowIntro(false)

      // Hide concerns prompt after user has responded
      if (showConcernsPrompt) {
        setShowConcernsPrompt(false)
      }

      // Animate the send button for feedback
      const sendButton = document.querySelector(".send-button")
      if (sendButton) {
        gsap.fromTo(
          sendButton,
          { scale: 1 },
          {
            scale: 0.9,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          },
        )
      }

      try {
        // Only include messages that are from the user or assistant (not local system messages)
        const messagesToSend = messages.filter((msg) => msg.source !== "local").concat(userMessage)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messagesToSend,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }))
          throw new Error(`Failed to fetch response: ${errorData.error || response.statusText}`)
        }

        const data = await response.json()

        if (!data.content) {
          throw new Error("No content received from API")
        }

        // Store model info if available
        if (data.source) {
          setModelInfo(data.source)
        }

        // Add assistant message
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.content,
          source: data.source || "api",
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Scroll to the new message with a smooth animation
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      } catch (error) {
        console.error("Error during chat:", error)
        setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")

        // Add error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your request. Please try again or use the Quick Facts feature while we resolve this issue.",
          source: "error",
        }

        setMessages((prev) => [...prev, errorMessage])
        setRetryMessage(userMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading, messages, handleSpecialCommands, scrollToBottom, showConcernsPrompt],
  )

  // Handle retry
  const handleRetry = useCallback(async () => {
    if (!retryMessage) return

    setErrorMessage(null)
    setIsLoading(true)

    // Animate retry button
    const retryButton = document.querySelector(".retry-button")
    if (retryButton) {
      gsap.fromTo(
        retryButton,
        { rotation: 0 },
        {
          rotation: 360,
          duration: 0.8,
          ease: "power2.inOut",
        },
      )
    }

    try {
      // Only include messages that are from the user or assistant (not local system messages)
      const messagesToSend = messages
        .filter((m) => m.source !== "local" && m.id !== retryMessage.id)
        .concat({
          role: "user",
          content: retryMessage.content,
        })

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSend,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to fetch response: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()

      if (!data.content) {
        throw new Error("No content received from API")
      }

      // Store model info if available
      if (data.source) {
        setModelInfo(data.source)
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content,
        source: data.source || "api",
      }

      // Replace the error message with the new response
      setMessages((prev) =>
        prev.map((m) => (m.source === "error" && m.id === prev[prev.length - 1].id ? assistantMessage : m)),
      )

      // Clear retry state
      setRetryMessage(null)

      // Scroll to the new message
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    } catch (error) {
      console.error("Error during retry:", error)
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred during retry")
    } finally {
      setIsLoading(false)
    }
  }, [retryMessage, messages, scrollToBottom])

  const handleFactSelect = useCallback((fact: string) => {
    setInput(fact)
    inputRef.current?.focus()

    // Animate the selected fact
    gsap.fromTo(
      ".selected-fact",
      { backgroundColor: "rgba(112, 9, 54, 0.2)" },
      {
        backgroundColor: "rgba(112, 9, 54, 0)",
        duration: 1,
        ease: "power2.out",
      },
    )
  }, [])

  // Scroll to bottom when messages change, but only if not showing intro
  useEffect(() => {
    if (!showIntro && messages.length > 0) {
      // Use a small delay to ensure the DOM has updated
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages, showIntro, scrollToBottom])

  // Set up intersection observer for scroll button - simplified and optimized
  useEffect(() => {
    // Only set up observer if not showing intro
    if (showIntro) {
      setShowScrollButton(false)
      return
    }

    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
        setShowScrollButton(!isAtBottom && messages.length > 2)
      }
    }

    const container = chatContainerRef.current
    if (container) {
      // Use passive event listener for better performance
      container.addEventListener("scroll", handleScroll, { passive: true })
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [messages.length, showIntro])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }

      // Escape to close dialogs
      if (e.key === "Escape") {
        if (showShareDialog) {
          setShowShareDialog(false)
          e.preventDefault()
        } else if (showFavorites) {
          setShowFavorites(false)
          e.preventDefault()
        } else if (commandPaletteOpen) {
          setCommandPaletteOpen(false)
          e.preventDefault()
        }
      }

      // Enter to submit when input is focused
      if (e.key === "Enter" && document.activeElement === inputRef.current && !e.shiftKey) {
        e.preventDefault()
        handleSubmit({ preventDefault: () => {} } as React.FormEvent)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSubmit, showShareDialog, showFavorites, commandPaletteOpen])

  const handleCommandFact = useCallback((factType: string) => {
    let factText = ""

    switch (factType) {
      case "salary":
        factText = "Tell me about the South African salary calculation"
        break
      case "debt":
        factText = "How long would it take to clear South Africa's national debt?"
        break
      case "free":
        factText = "How do products become free in the Equidistributed Salary model?"
        break
      case "enterprise":
        factText = "Explain the Enterprise Contribution concept"
        break
      case "distribution":
        factText = "How does the continuous redistribution work?"
        break
      case "education":
        factText = "How would education work in the Equidistributed Salary model?"
        break
      case "model":
        factText = "/model"
        break
      case "help":
        factText = "What can you help me with?"
        break
      case "concerns":
        setShowConcernsPrompt(true)
        setCommandPaletteOpen(false)
        return
      default:
        factText = factType
    }

    setInput(factText)
    setCommandPaletteOpen(false)
    inputRef.current?.focus()

    // Animate the input to show it received the command
    if (inputRef.current) {
      gsap.fromTo(
        inputRef.current,
        { backgroundColor: "rgba(112, 9, 54, 0.1)" },
        {
          backgroundColor: "rgba(51, 65, 85, 0.9)",
          duration: 0.8,
          ease: "power2.out",
        },
      )
    }
  }, [])

  // Optimize animations based on device capability and preferences
  const animationConfig = useMemo(
    () => ({
      headerAnimation: {
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: prefersReducedMotion ? 0.1 : 0.5, ease: "easeOut" },
      },
      messageAnimation: {
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: prefersReducedMotion ? 0 : -20 },
        transition: { duration: prefersReducedMotion ? 0.1 : 0.4 },
      },
      buttonAnimation: {
        whileHover: prefersReducedMotion ? {} : { scale: 1.05 },
        whileTap: prefersReducedMotion ? {} : { scale: 0.95 },
      },
      inputAnimation: {
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: prefersReducedMotion ? 0.1 : 0.5, delay: 0.2 },
      },
    }),
    [prefersReducedMotion],
  )

  // Memoize the message list to prevent unnecessary re-renders
  const messageList = useMemo(() => {
    return messages.map((message, index) => (
      <motion.div
        key={message.id}
        layout="position"
        className="chat-message rounded-corners overflow-hidden"
        data-message-id={message.id}
        {...animationConfig.messageAnimation}
        transition={{
          ...animationConfig.messageAnimation.transition,
          delay: isInitialLoad ? index * 0.05 : 0,
        }}
      >
        <MemoizedChatMessage
          message={message}
          onFavorite={!message.role || message.role === "assistant" ? handleToggleFavorite : undefined}
          onShare={!message.role || message.role === "assistant" ? handleShare : undefined}
          isFavorited={isMessageFavorited(message.id)}
        />
        {retryMessage && message.source === "error" && message === messages[messages.length - 1] && (
          <motion.div
            className="flex justify-center mt-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <motion.button
              onClick={handleRetry}
              disabled={isLoading}
              className="retry-button flex items-center gap-1 text-xs bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-3 py-1.5 rounded-full-force shadow-md"
              style={{ borderRadius: "9999px !important" }}
              {...animationConfig.buttonAnimation}
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    ))
  }, [
    messages,
    retryMessage,
    isLoading,
    animationConfig,
    handleToggleFavorite,
    handleShare,
    isMessageFavorited,
    handleRetry,
    isInitialLoad,
  ])

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 shadow-md backdrop-blur-sm z-10"
        style={{ borderRadius: "0 !important" }}
        {...animationConfig.headerAnimation}
      >
        <motion.div
          className="flex items-center gap-2"
          whileHover={prefersReducedMotion ? {} : { x: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div
            className="bg-gradient-to-r from-[#700936] to-[#9c1c4e] p-2 rounded-full shadow-lg"
            style={{ borderRadius: "9999px !important" }}
            whileHover={
              prefersReducedMotion
                ? {}
                : {
                    scale: 1.1,
                    rotate: [0, -5, 5, -5, 0],
                    boxShadow: "0 0 15px rgba(156, 28, 78, 0.5)",
                  }
            }
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
          <motion.h1
            className="text-lg font-semibold text-white"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    textShadow: [
                      "0 0 5px rgba(255,255,255,0.1)",
                      "0 0 8px rgba(255,255,255,0.2)",
                      "0 0 5px rgba(255,255,255,0.1)",
                    ],
                  }
            }
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            Equidistributed Salary Aide
          </motion.h1>
          {modelInfo && (
            <motion.div
              className="hidden md:flex items-center ml-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span
                className="text-xs px-2 py-0.5 bg-slate-700/80 text-slate-300 rounded-full shadow-inner backdrop-blur-sm"
                style={{ borderRadius: "9999px !important" }}
              >
                {modelInfo}
              </span>
            </motion.div>
          )}
        </motion.div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setShowFavorites(true)}
            className="flex items-center gap-1 text-sm text-slate-300 hover:text-white px-2 py-1 rounded-md hover:bg-slate-700/50 transition-colors"
            style={{ borderRadius: "0.375rem !important" }}
            {...animationConfig.buttonAnimation}
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
          </motion.button>
          <motion.button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-1 text-sm text-slate-300 hover:text-white px-2 py-1 rounded-md hover:bg-slate-700/50 transition-colors"
            style={{ borderRadius: "0.375rem !important" }}
            {...animationConfig.buttonAnimation}
          >
            <Command className="h-4 w-4" />
            <span className="hidden sm:inline">Commands</span>
            <span className="text-xs text-slate-400 ml-1 hidden sm:inline">(Ctrl+K)</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Error Banner */}
      <AnimatePresence mode="wait">
        {errorMessage && (
          <motion.div
            className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-l-4 border-red-500 p-4 shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0.8, rotate: 0 }}
                animate={{ scale: 1, rotate: prefersReducedMotion ? 0 : [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              </motion.div>
              <div>
                <h3 className="text-sm font-medium text-red-500">Error connecting to AI service</h3>
                <p className="text-xs text-slate-300 mt-1">{errorMessage}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Try using the quick facts or calculator while we resolve this issue.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-container bg-gradient-to-b from-slate-800/50 to-slate-900/50"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#4B5563 #1F2937" }}
      >
        {showIntro ? (
          <IntroScreen />
        ) : (
          <>
            <QuickFacts onSelectFact={handleFactSelect} />
            {!showIntro &&
              messages.length > 1 &&
              !messages.some((m) => m.content.includes("What is it about South Africa or your country")) &&
              showConcernsPrompt && (
                <motion.div
                  className="mb-4 concerns-prompt"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <motion.div
                    className="w-full p-4 rounded-lg bg-gradient-to-r from-slate-700/90 to-slate-800/90 text-white shadow-md backdrop-blur-sm border border-slate-700/50"
                    style={{ borderRadius: "0.5rem !important" }}
                    whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="bg-gradient-to-r from-[#700936] to-[#9c1c4e] p-2 rounded-full shadow-lg flex-shrink-0 mt-1"
                        style={{ borderRadius: "9999px !important" }}
                      >
                        <HelpCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2">Share Your Concerns</h3>
                        <p className="text-slate-300 mb-3">
                          What is it about South Africa or your country that is currently your issue or concern about
                          the system?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Type your concerns here..."
                            className="flex-1 p-2 rounded-md bg-slate-600/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#700936] border border-slate-600"
                            style={{ borderRadius: "0.375rem !important" }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => {
                              // Smooth scroll to make sure the input is visible
                              if (chatContainerRef.current) {
                                const concernsPrompt = chatContainerRef.current.querySelector(".concerns-prompt")
                                if (concernsPrompt) {
                                  concernsPrompt.scrollIntoView({ behavior: "smooth", block: "center" })
                                }
                              }
                            }}
                          />
                          <motion.button
                            onClick={() => {
                              if (input.trim()) {
                                handleSubmit({ preventDefault: () => {} } as React.FormEvent)
                              }
                            }}
                            disabled={!input.trim() || isLoading}
                            className={cn(
                              "px-4 py-2 rounded-md bg-gradient-to-r from-[#700936] to-[#9c1c4e] text-white",
                              "disabled:opacity-50 transition-all hover:shadow-lg",
                            )}
                            style={{ borderRadius: "0.375rem !important" }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Send className="h-4 w-4" />
                          </motion.button>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                          Your response will help me explain how the Equidistributed Salary model could address these
                          specific concerns.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            <div ref={messagesRef} className="space-y-4">
              <AnimatePresence mode="popLayout">{messageList}</AnimatePresence>
            </div>
          </>
        )}

        {isLoading && (
          <motion.div
            className="flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="flex-shrink-0 bg-gradient-to-r from-[#700936] to-[#9c1c4e] p-2 rounded-full shadow-lg"
              style={{ borderRadius: "9999px !important" }}
            >
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div
              className="flex space-x-2 p-4 rounded-lg bg-gradient-to-br from-slate-700/90 to-slate-800/90 text-white max-w-[80%] shadow-md backdrop-blur-sm"
              style={{ borderRadius: "0.5rem !important" }}
            >
              <div className="typing-indicator">
                <motion.span
                  className="typing-dot"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 1, 0.4],
                        }
                  }
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                ></motion.span>
                <motion.span
                  className="typing-dot"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 1, 0.4],
                        }
                  }
                  transition={{
                    duration: 1,
                    delay: 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                ></motion.span>
                <motion.span
                  className="typing-dot"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 1, 0.4],
                        }
                  }
                  transition={{
                    duration: 1,
                    delay: 0.4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                ></motion.span>
              </div>
            </div>
          </motion.div>
        )}

        {showCalculator && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Suspense
              fallback={
                <div
                  className="p-4 bg-slate-800/50 rounded-lg animate-pulse"
                  style={{ borderRadius: "0.5rem !important" }}
                >
                  <div className="h-8 w-48 bg-slate-700/50 rounded mb-4"></div>
                  <div className="h-4 w-full bg-slate-700/50 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-slate-700/50 rounded mb-4"></div>
                  <div className="h-10 w-full bg-slate-700/50 rounded"></div>
                </div>
              }
            >
              <SalaryCalculator />
            </Suspense>
            <div className="flex justify-end mt-2">
              <motion.button
                onClick={() => setShowCalculator(false)}
                className="text-sm text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-700/50 transition-colors"
                style={{ borderRadius: "0.25rem !important" }}
                {...animationConfig.buttonAnimation}
              >
                Close Calculator
              </motion.button>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence mode="wait">
        {showScrollButton && (
          <motion.button
            className="absolute bottom-24 right-4 p-2 bg-slate-900/80 text-slate-300 rounded-full shadow-md hover:bg-slate-800 hover:text-white transition-colors backdrop-blur-sm"
            style={{ borderRadius: "9999px !important" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToBottom}
            {...animationConfig.buttonAnimation}
          >
            <ArrowDown className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input form */}
      <motion.div
        className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg backdrop-blur-sm input-area"
        {...animationConfig.inputAnimation}
      >
        <form onSubmit={handleSubmit} className="flex gap-2">
          <motion.div
            className="relative flex-1"
            whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Equidistributed Salary..."
              className="w-full p-3 rounded-lg bg-slate-700/90 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#700936] transition-all shadow-inner backdrop-blur-sm chat-input"
              style={{ borderRadius: "0.5rem !important" }}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <motion.button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="text-slate-400 hover:text-white"
                title="Open command palette (Ctrl+K)"
                whileHover={prefersReducedMotion ? {} : { scale: 1.2, rotate: 15 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
              >
                <Command className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
          <motion.button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="send-button p-3 rounded-lg bg-gradient-to-r from-[#700936] to-[#9c1c4e] text-white disabled:opacity-50 transition-all hover:shadow-lg"
            style={{ borderRadius: "0.5rem !important" }}
            {...animationConfig.buttonAnimation}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </form>
        <motion.div
          className="text-xs text-slate-400 mt-2 text-center helper-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Type <span className="text-slate-300 font-mono">/calculator</span> to open the salary calculator,{" "}
          <span className="text-slate-300 font-mono">/model</span> for model info, or press{" "}
          <span className="text-slate-300 font-mono">Ctrl+K</span> for commands.
        </motion.div>
      </motion.div>

      {/* Dialogs - Only render when needed */}
      {commandPaletteOpen && (
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onShowCalculator={() => setShowCalculator(true)}
          onShowFact={handleCommandFact}
        />
      )}

      {showShareDialog && (
        <ShareDialog isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} content={shareContent} />
      )}

      {showFavorites && (
        <FavoritesDialog
          isOpen={showFavorites}
          onClose={() => setShowFavorites(false)}
          onSelectFavorite={handleSelectFavorite}
        />
      )}
    </div>
  )
}
