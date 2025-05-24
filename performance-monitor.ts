// Performance monitoring utility to help identify and fix performance issues

// Frame rate monitoring
let frameCount = 0
let lastFrameTime = 0
let fps = 60
let lowFpsCount = 0
let isMonitoring = false
let frameCallback: ((fps: number) => void) | null = null

// Start monitoring frame rate
export function startFrameRateMonitoring(callback?: (fps: number) => void) {
  if (isMonitoring) return

  isMonitoring = true
  frameCount = 0
  lastFrameTime = performance.now()
  lowFpsCount = 0
  frameCallback = callback || null

  requestAnimationFrame(monitorFrameRate)
}

// Stop monitoring frame rate
export function stopFrameRateMonitoring() {
  isMonitoring = false
  frameCallback = null
}

// Monitor frame rate
function monitorFrameRate(timestamp: number) {
  if (!isMonitoring) return

  frameCount++

  // Calculate FPS every second
  if (timestamp - lastFrameTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (timestamp - lastFrameTime))

    // Check for low frame rate
    if (fps < 30) {
      lowFpsCount++
      console.warn(`Low frame rate detected: ${fps} FPS`)

      // Suggest optimizations if consistently low
      if (lowFpsCount >= 3) {
        suggestOptimizations()
      }
    } else {
      // Reset counter if frame rate recovers
      lowFpsCount = Math.max(0, lowFpsCount - 1)
    }

    // Call callback if provided
    if (frameCallback) {
      frameCallback(fps)
    }

    frameCount = 0
    lastFrameTime = timestamp
  }

  requestAnimationFrame(monitorFrameRate)
}

// Suggest optimizations based on performance issues
function suggestOptimizations() {
  console.warn("Performance optimizations suggested:")
  console.warn("1. Reduce animation complexity")
  console.warn("2. Implement virtualization for long lists")
  console.warn("3. Optimize React renders (use memo, useCallback)")
  console.warn("4. Check for layout thrashing")
  console.warn("5. Reduce DOM size and complexity")
}

// Memory usage monitoring
export function checkMemoryUsage() {
  if (performance && "memory" in performance) {
    const memory = (performance as any).memory
    if (memory) {
      const usedHeapSize = Math.round(memory.usedJSHeapSize / (1024 * 1024))
      const totalHeapSize = Math.round(memory.totalJSHeapSize / (1024 * 1024))
      const heapLimit = Math.round(memory.jsHeapSizeLimit / (1024 * 1024))

      console.info(`Memory usage: ${usedHeapSize}MB / ${totalHeapSize}MB (Limit: ${heapLimit}MB)`)

      // Warn if memory usage is high
      if (usedHeapSize > totalHeapSize * 0.8) {
        console.warn("High memory usage detected. Consider implementing memory optimizations.")
      }
    }
  }
}

// Layout thrashing detection
let scheduledAnimationFrame = false
const readOperations: Array<() => any> = []
const writeOperations: Array<(readResults?: any[]) => void> = []

// Schedule DOM reads and writes to prevent layout thrashing
export function scheduleRead(readFn: () => any) {
  readOperations.push(readFn)
  scheduleFlush()
  return readFn
}

export function scheduleWrite(writeFn: (readResults?: any[]) => void) {
  writeOperations.push(writeFn)
  scheduleFlush()
  return writeFn
}

function scheduleFlush() {
  if (!scheduledAnimationFrame) {
    scheduledAnimationFrame = true
    requestAnimationFrame(flushOperations)
  }
}

function flushOperations() {
  // First, read from the DOM
  const readResults = readOperations.map((read) => read())

  // Then, batch write operations
  writeOperations.forEach((write) => write(readResults))

  // Reset
  readOperations.length = 0
  writeOperations.length = 0
  scheduledAnimationFrame = false
}

// Detect device capabilities
export function detectDeviceCapabilities() {
  const capabilities = {
    highPerformance: true,
    supportsWebGL: false,
    touchDevice: false,
    prefersReducedMotion: false,
    lowPowerMode: false,
    slowConnection: false,
  }

  // Check for WebGL support
  try {
    const canvas = document.createElement("canvas")
    capabilities.supportsWebGL = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )
  } catch (e) {
    capabilities.supportsWebGL = false
  }

  // Check for touch device
  capabilities.touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0

  // Check for reduced motion preference
  if (window.matchMedia) {
    capabilities.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  // Check for slow connection
  if (navigator.connection) {
    const connection = navigator.connection as any
    capabilities.slowConnection =
      connection.saveData || (connection.effectiveType && ["slow-2g", "2g", "3g"].includes(connection.effectiveType))
  }

  // Determine if device is likely low performance
  if (capabilities.touchDevice && !capabilities.supportsWebGL) {
    capabilities.highPerformance = false
  }

  if (capabilities.prefersReducedMotion || capabilities.slowConnection) {
    capabilities.lowPowerMode = true
  }

  return capabilities
}

// Export a function to optimize based on device capabilities
export function getOptimizationLevel() {
  const capabilities = detectDeviceCapabilities()

  if (capabilities.lowPowerMode || capabilities.prefersReducedMotion) {
    return "minimal"
  } else if (!capabilities.highPerformance || capabilities.touchDevice) {
    return "reduced"
  } else {
    return "full"
  }
}
