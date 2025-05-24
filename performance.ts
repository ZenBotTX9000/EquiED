import type React from "react"
/**
 * Performance optimization utilities
 */

// Debounce function to limit how often a function is called
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle function to limit the rate at which a function is executed
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number

  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args)
      lastRan = Date.now()
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan),
      )
    }
  }
}

// RAF throttle for smooth animations
export function rafThrottle<T extends (...args: any[]) => any>(callback: T): (...args: Parameters<T>) => void {
  let requestId: number | null = null
  let lastArgs: Parameters<T>

  const later = () => {
    requestId = null
    callback(...lastArgs)
  }

  return (...args: Parameters<T>): void => {
    lastArgs = args

    if (requestId === null) {
      requestId = requestAnimationFrame(later)
    }
  }
}

// Batch DOM updates to reduce layout thrashing
export function batchDomUpdates(updates: (() => void)[]): void {
  // Read phase - force layout
  document.body.offsetHeight

  // Write phase - batch updates
  requestAnimationFrame(() => {
    updates.forEach((update) => update())
  })
}

// Measure performance of a function
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  label: string,
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now()
    const result = fn(...args)
    const end = performance.now()

    console.log(`${label} took ${end - start}ms`)

    return result
  }
}

// Check if the browser supports certain performance features
export function checkPerformanceSupport(): {
  requestAnimationFrame: boolean
  requestIdleCallback: boolean
  intersectionObserver: boolean
  mutationObserver: boolean
  resizeObserver: boolean
} {
  return {
    requestAnimationFrame: typeof window !== "undefined" && "requestAnimationFrame" in window,
    requestIdleCallback: typeof window !== "undefined" && "requestIdleCallback" in window,
    intersectionObserver: typeof window !== "undefined" && "IntersectionObserver" in window,
    mutationObserver: typeof window !== "undefined" && "MutationObserver" in window,
    resizeObserver: typeof window !== "undefined" && "ResizeObserver" in window,
  }
}

// Virtual list implementation for efficient rendering of large lists
export function createVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  renderItem,
}: {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
}): {
  containerProps: { style: React.CSSProperties }
  virtualItems: { index: number; item: T; offsetTop: number }[]
} {
  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(window.scrollY / itemHeight) - overscan)
  const endIndex = Math.min(items.length - 1, Math.floor((window.scrollY + containerHeight) / itemHeight) + overscan)

  const virtualItems = []

  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      item: items[i],
      offsetTop: i * itemHeight,
    })
  }

  return {
    containerProps: {
      style: {
        height: `${totalHeight}px`,
        position: "relative",
      },
    },
    virtualItems,
  }
}
