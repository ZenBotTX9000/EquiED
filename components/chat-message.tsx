"use client"

import React from "react" // Added explicit React import
// import { motion, useReducedMotion } from "framer-motion" // Commenting out for simplification
import { Bot, User, Copy, Check, AlertTriangle, Star, StarOff, Share2 } from "lucide-react"
import type { Message } from "./chat-interface"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect, memo, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin)
}

// Memoize the ChatMessage component to prevent unnecessary re-renders
const ChatMessage = memo(function ChatMessage({
  message,
  onFavorite,
  onShare,
  isFavorited = false,
  className,
}: {
  message: Message
  onFavorite?: (message: Message) => void
  onShare?: (message: Message) => void
  isFavorited?: boolean
  className?: string
}) {
  const isUser = message.role === "user"
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const tableRefs = useRef<(HTMLTableElement | null)[]>([])
  const messageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Check if user prefers reduced motion
  const prefersReducedMotion = false; // Set to false as useReducedMotion is commented out

  // Use GSAP for animations
  useGSAP(() => {
    if (!messageRef.current || prefersReducedMotion) return

    // Add subtle hover effect to message
    const messageElement = messageRef.current

    // Create hover animation
    const hoverAnimation = gsap.timeline({ paused: true })
    hoverAnimation.to(messageElement, {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)",
      scale: 1.01,
      duration: 0.3,
      ease: "power2.out",
    })

    // Set up event listeners
    messageElement.addEventListener("mouseenter", () => hoverAnimation.play())
    messageElement.addEventListener("mouseleave", () => hoverAnimation.reverse())

    // Clean up
    return () => {
      messageElement.removeEventListener("mouseenter", () => hoverAnimation.play())
      messageElement.removeEventListener("mouseleave", () => hoverAnimation.reverse())
    }
  }, [prefersReducedMotion])

  // Process tables to make them responsive
  useEffect(() => {
    if (isUser) return

    // Process each table to add responsive wrappers and data attributes for mobile view
    tableRefs.current.forEach((table) => {
      if (!table) return

      // Add responsive wrapper if not already wrapped
      if (!table.parentElement?.classList.contains("responsive-table")) {
        const wrapper = document.createElement("div")
        wrapper.className = "responsive-table"
        table.parentNode?.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      }

      // Add data attributes for mobile card view
      const headers = Array.from(table.querySelectorAll("th")).map((th) => th.textContent)

      table.querySelectorAll("tbody tr").forEach((row) => {
        Array.from(row.querySelectorAll("td")).forEach((cell, index) => {
          if (headers[index]) {
            cell.setAttribute("data-label", headers[index] || "")
          }
        })
      })

      // Add card-table class for very small screens
      table.classList.add("card-table")
    })
  }, [message.content, isUser])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)

    // Add copy animation feedback
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { backgroundColor: "rgba(112, 9, 54, 0.05)" },
        {
          backgroundColor: "rgba(0, 0, 0, 0)",
          duration: 1,
          ease: "power2.out",
        },
      )
    }

    setTimeout(() => setCopied(false), 2000)
  }, [message.content])

  // Enhanced animation variants - optimized for performance
  const containerVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: [0.25, 0.1, 0.25, 1], // Improved easing curve
        when: "beforeChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -20,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.3, ease: "easeInOut" },
    },
  }

  const iconVariants = {
    hidden: { scale: prefersReducedMotion ? 1 : 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.4,
        delay: prefersReducedMotion ? 0 : 0.1,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  const messageVariants = {
    hidden: { scale: prefersReducedMotion ? 1 : 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.4,
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  }

  const actionButtonVariants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.3 },
    },
    hover: {
      scale: prefersReducedMotion ? 1 : 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: { duration: 0.1 },
    },
  }

  // Reset table refs when content changes
  useEffect(() => {
    tableRefs.current = []
  }, [message.content])

  // Add subtle entrance animation for new messages
  useEffect(() => {
    if (messageRef.current && !prefersReducedMotion) {
      // Initial entrance animation
      gsap.fromTo(
        messageRef.current,
        {
          y: 20,
          opacity: 0,
          scale: 0.98,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          clearProps: "all", // Clean up after animation completes
        },
      )

      // For assistant messages, add a subtle highlight animation
      if (!isUser && contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          {
            boxShadow: "0 0 0 1px rgba(112, 9, 54, 0)",
          },
          {
            boxShadow: "0 0 0 1px rgba(112, 9, 54, 0.3)",
            duration: 0.5,
            delay: 0.3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              // Ensure we clean up the animation
              gsap.set(contentRef.current, { clearProps: "boxShadow" })
            },
          },
        )
      }
    }
  }, [prefersReducedMotion, isUser])

  // const MotionDiv = motion.div; // Workaround commented out

  return (
    <div // Ensuring this is a plain div
      ref={messageRef}
      // Removing Framer Motion props
      className={cn("flex items-start gap-3 p-1", isUser && "justify-end", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-message-id={message.id}
    >
      {!isUser && (
        <div // Ensuring this is a plain div
          className="flex-shrink-0 bg-gradient-to-r from-[#700936] to-[#9c1c4e] p-2 rounded-full shadow-lg"
        >
          {message.source === "error" ? (
            <AlertTriangle className="h-5 w-5 text-white drop-shadow-sm" />
          ) : (
            <Bot className="h-5 w-5 text-white drop-shadow-sm" />
          )}
        </div>
      )}

      <div
        ref={contentRef}
        className={cn(
          "p-4 rounded-lg shadow-md backdrop-blur-sm max-w-[80%]",
          isUser
            ? "bg-gradient-to-br from-slate-600/90 to-slate-700/90 text-white"
            : message.source === "error"
              ? "bg-red-500/20 border border-red-500/50 text-white"
              : message.source === "local"
                ? "bg-gradient-to-br from-slate-700/90 to-slate-800/90 border border-[#700936]/30 text-white"
                : "bg-gradient-to-br from-slate-700/90 to-slate-800/90 text-white",
          "prose prose-invert max-w-none break-words overflow-wrap-anywhere",
        )}
        style={{ borderRadius: "0.5rem !important", wordBreak: "break-word", overflowWrap: "break-word" }}
        // variants={messageVariants} // Removed variants from the inner div as well
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-3 pb-1 border-b border-slate-600/50">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold mb-3 pb-1 border-b border-slate-600/50">{children}</h2>
                ),
                h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff9eb7] hover:underline transition-all duration-200 hover:text-[#ffb8cb]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-slate-200">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#700936] pl-3 italic my-3 bg-slate-800/30 py-2 pr-2 rounded-r">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-slate-200">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-slate-800 p-3 rounded-lg overflow-x-auto my-3 border border-slate-700/50 shadow-inner">
                    {children}
                  </pre>
                ),
                table: ({ children, ...props }) => (
                  <table
                    {...props}
                    ref={(el) => {
                      if (el) tableRefs.current.push(el)
                    }}
                    className="min-w-full divide-y divide-slate-600 my-3 border border-slate-700/50 rounded-lg overflow-hidden shadow-md"
                  >
                    {children}
                  </table>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gradient-to-r from-[#700936]/80 to-[#9c1c4e]/80 text-white">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-slate-600/50 bg-slate-800/30">{children}</tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-slate-700/30 transition-colors duration-150">{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-sm border-t border-slate-700/30 whitespace-normal break-words">
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {message.source === "fallback" && (
          <div className="mt-2 text-xs text-yellow-300 flex items-center gap-1 bg-yellow-500/10 p-2 rounded-md">
            <AlertTriangle className="h-3 w-3" />
            <span>Using fallback response due to connection issues</span>
          </div>
        )}

        <div // Ensuring action buttons container is plain div
          className="mt-3 flex justify-end gap-2"
          style={{ opacity: isHovered || isFavorited ? 1 : 0, transition: "opacity 0.3s" }}
        >
          {!isUser && onFavorite && (
            <button // Ensuring this is a plain button
              onClick={() => onFavorite(message)}
              className="favorite-button flex items-center gap-1 text-xs text-slate-400 hover:text-yellow-400 bg-slate-800/80 backdrop-blur-sm px-2 py-1 shadow-md rounded-corners rounded-button"
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorited ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
              <span>{isFavorited ? "Unfavorite" : "Favorite"}</span>
            </button>
          )}

          {!isUser && onShare && (
            <button // Ensuring this is a plain button
              onClick={() => onShare(message)}
              className="share-button flex items-center gap-1 text-xs text-slate-400 hover:text-blue-400 bg-slate-800/80 backdrop-blur-sm px-2 py-1 shadow-md rounded-corners rounded-button"
              title="Share this response"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </button>
          )}

          <button // Ensuring this is a plain button
            onClick={handleCopy}
            className="copy-button flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 backdrop-blur-sm px-2 py-1 shadow-md rounded-corners rounded-button"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {isUser && (
        <div // Ensuring this is a plain div
          className="flex-shrink-0 bg-gradient-to-br from-slate-500 to-slate-600 p-2 shadow-lg rounded-full-force"
        >
          <User className="h-5 w-5 text-white drop-shadow-sm" />
        </div>
      )}
    </div> // Ensuring this is a plain div
  )
})

export default ChatMessage
