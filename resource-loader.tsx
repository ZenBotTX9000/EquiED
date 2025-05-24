"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

interface ResourceLoaderProps {
  children: React.ReactNode
  priority?: ("style" | "script" | "font" | "image")[]
  preconnect?: string[]
  prefetch?: string[]
  preload?: Array<{
    href: string
    as: "style" | "script" | "font" | "image"
    type?: string
    crossOrigin?: "anonymous" | "use-credentials"
  }>
  deferNonCritical?: boolean
}

export function ResourceLoader({
  children,
  priority = ["style", "font", "script", "image"],
  preconnect = [],
  prefetch = [],
  preload = [],
  deferNonCritical = true,
}: ResourceLoaderProps) {
  const [resourcesLoaded, setResourcesLoaded] = useState(false)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (hasMounted.current) return
    hasMounted.current = true

    // Add preconnect links
    preconnect.forEach((url) => {
      const link = document.createElement("link")
      link.rel = "preconnect"
      link.href = url
      link.crossOrigin = "anonymous"
      document.head.appendChild(link)
    })

    // Add preload links based on priority
    const priorityMap: Record<string, number> = {}
    priority.forEach((type, index) => {
      priorityMap[type] = index
    })

    // Sort preload resources by priority
    const sortedPreload = [...preload].sort((a, b) => {
      return (priorityMap[a.as] || 999) - (priorityMap[b.as] || 999)
    })

    // Add preload links
    sortedPreload.forEach((resource) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin
      document.head.appendChild(link)
    })

    // Add prefetch links (lower priority, for future navigation)
    if (deferNonCritical) {
      // Defer prefetch until after critical resources are loaded
      window.addEventListener("load", () => {
        setTimeout(() => {
          prefetch.forEach((url) => {
            const link = document.createElement("link")
            link.rel = "prefetch"
            link.href = url
            document.head.appendChild(link)
          })
        }, 200) // Small delay after load
      })
    } else {
      // Add prefetch immediately
      prefetch.forEach((url) => {
        const link = document.createElement("link")
        link.rel = "prefetch"
        link.href = url
        document.head.appendChild(link)
      })
    }

    setResourcesLoaded(true)
  }, [preconnect, prefetch, preload, priority, deferNonCritical])

  return <>{children}</>
}
