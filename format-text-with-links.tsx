"use client"

import type React from "react"

export function formatTextWithLinks(text: string): React.ReactNode {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g

  // Split the text by URLs
  const parts = text.split(urlRegex)

  // Find all URLs in the text
  const urls = text.match(urlRegex) || []

  // Combine parts and URLs
  const result: React.ReactNode[] = []

  parts.forEach((part, i) => {
    // Add the text part
    result.push(part)

    // Add the URL if there is one
    if (urls[i]) {
      result.push(
        <a
          key={i}
          href={urls[i]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff9eb7] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {urls[i]}
        </a>,
      )
    }
  })

  return result
}
