"use client"

import type React from "react"
import { useState, useEffect, useRef, memo } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholderColor?: string
  lazyLoad?: boolean
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

const OptimizedImage = memo(
  ({
    src,
    alt,
    width,
    height,
    className,
    placeholderColor = "#f3f4f6",
    lazyLoad = true,
    priority = false,
    onLoad,
    onError,
    ...props
  }: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
      // Reset states when src changes
      setIsLoaded(false)
      setError(false)
    }, [src])

    useEffect(() => {
      const currentImgRef = imgRef.current

      // If priority is true, load immediately without intersection observer
      if (priority || !lazyLoad) {
        const img = new Image()
        img.src = src
        img.onload = () => {
          setIsLoaded(true)
          onLoad?.()
        }
        img.onerror = () => {
          setError(true)
          onError?.()
        }
        return
      }

      // Use Intersection Observer for lazy loading
      if (currentImgRef && "IntersectionObserver" in window) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = new Image()
                img.src = src
                img.onload = () => {
                  setIsLoaded(true)
                  onLoad?.()
                  observerRef.current?.unobserve(currentImgRef)
                }
                img.onerror = () => {
                  setError(true)
                  onError?.()
                  observerRef.current?.unobserve(currentImgRef)
                }
              }
            })
          },
          {
            rootMargin: "200px 0px", // Start loading when image is 200px from viewport
            threshold: 0.01,
          },
        )

        observerRef.current.observe(currentImgRef)
      } else {
        // Fallback for browsers without Intersection Observer
        const img = new Image()
        img.src = src
        img.onload = () => {
          setIsLoaded(true)
          onLoad?.()
        }
        img.onerror = () => {
          setError(true)
          onError?.()
        }
      }

      return () => {
        if (observerRef.current && currentImgRef) {
          observerRef.current.unobserve(currentImgRef)
        }
      }
    }, [src, lazyLoad, priority, onLoad, onError])

    return (
      <div
        className={cn("relative overflow-hidden", className)}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
          backgroundColor: placeholderColor,
        }}
      >
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
            <span className="text-sm">Failed to load image</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={isLoaded || priority || !lazyLoad ? src : ""}
            alt={alt}
            width={width}
            height={height}
            className={cn("transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0")}
            loading={lazyLoad && !priority ? "lazy" : undefined}
            decoding="async"
            {...props}
          />
        )}

        {!isLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    )
  },
)

OptimizedImage.displayName = "OptimizedImage"

export { OptimizedImage }
