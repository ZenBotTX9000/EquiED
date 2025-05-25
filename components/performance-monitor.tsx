"use client"

import { useEffect, useState, useRef } from "react"
// import { throttle } from "@/lib/performance" // throttle removed

interface PerformanceMetrics {
  fps: number
  memory: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null
  timing: {
    domComplete: number
    domInteractive: number
    loadEventEnd: number
  }
}

// Only enable in development mode
const isDev = process.env.NODE_ENV === "development"

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: null,
    timing: {
      domComplete: 0,
      domInteractive: 0,
      loadEventEnd: 0,
    },
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const animationFrameIdRef = useRef<number | null>(null)
  const fpsHistory = useRef<number[]>([])

  // Calculate FPS with smoothing
  useEffect(() => {
    if (!isDev) return

    const calculateFps = () => {
      const now = performance.now()
      const elapsed = now - lastTimeRef.current

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed)

        // Keep a history of FPS values for smoothing
        fpsHistory.current.push(currentFps)
        if (fpsHistory.current.length > 5) {
          fpsHistory.current.shift()
        }

        // Calculate average FPS for smoother display
        const avgFps = Math.round(fpsHistory.current.reduce((sum, fps) => sum + fps, 0) / fpsHistory.current.length)

        setMetrics((prev) => ({
          ...prev,
          fps: avgFps,
        }))

        frameCountRef.current = 0
        lastTimeRef.current = now
      }

      frameCountRef.current++
      animationFrameIdRef.current = requestAnimationFrame(calculateFps)
    }

    animationFrameIdRef.current = requestAnimationFrame(calculateFps)

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [])

  // Get memory usage if available
  useEffect(() => {
    if (!isDev) return

    const updateMemoryInfo = () => { // throttle removed
      if (performance && (performance as any).memory) {
        const memoryInfo = (performance as any).memory
        setMetrics((prev) => ({
          ...prev,
          memory: {
            usedJSHeapSize: memoryInfo.usedJSHeapSize,
            totalJSHeapSize: memoryInfo.totalJSHeapSize,
            jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
          },
        }))
      }
    } // Removed trailing ', 2000)'

    updateMemoryInfo()
    const intervalId = setInterval(updateMemoryInfo, 2000)

    return () => clearInterval(intervalId)
  }, [])

  // Get page load timing metrics
  useEffect(() => {
    if (!isDev) return

    const updateTimingMetrics = () => {
      const timing = performance.timing || (performance as any).getEntriesByType("navigation")[0]

      if (timing) {
        setMetrics((prev) => ({
          ...prev,
          timing: {
            domComplete: timing.domComplete - timing.navigationStart || 0,
            domInteractive: timing.domInteractive - timing.navigationStart || 0,
            loadEventEnd: timing.loadEventEnd - timing.navigationStart || 0,
          },
        }))
      }
    }

    // Wait for the page to fully load
    if (document.readyState === "complete") {
      updateTimingMetrics()
    } else {
      window.addEventListener("load", updateTimingMetrics)
      return () => window.removeEventListener("load", updateTimingMetrics)
    }
  }, [])

  return metrics
}

interface PerformanceMonitorProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  showInProduction?: boolean
}

export function PerformanceMonitor({ position = "bottom-right", showInProduction = false }: PerformanceMonitorProps) {
  const metrics = usePerformanceMonitoring()

  // Only show in development unless explicitly enabled
  if (!isDev && !showInProduction) return null

  const positionClasses = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-2 right-2",
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 bg-black/80 text-white p-2 rounded-md text-xs font-mono pointer-events-none`}
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={metrics.fps < 30 ? "text-red-400" : metrics.fps < 50 ? "text-yellow-400" : "text-green-400"}>
            {metrics.fps}
          </span>
        </div>

        {metrics.memory && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span>
              {formatBytes(metrics.memory.usedJSHeapSize)} / {formatBytes(metrics.memory.jsHeapSizeLimit)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span>DOM Interactive:</span>
          <span>{metrics.timing.domInteractive}ms</span>
        </div>

        <div className="flex justify-between">
          <span>Load Complete:</span>
          <span>{metrics.timing.loadEventEnd}ms</span>
        </div>
      </div>
    </div>
  )
}
