// Image optimization utilities

// Function to check if an image is in the viewport
export function isImageInViewport(element: HTMLImageElement): boolean {
  if (!element) return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// Function to lazy load images
export function setupLazyLoading() {
  if (typeof window === "undefined") return

  // Use Intersection Observer if available
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const dataSrc = img.getAttribute("data-src")

            if (dataSrc) {
              img.src = dataSrc
              img.removeAttribute("data-src")
              img.classList.add("fade-in")
            }

            // Stop observing once loaded
            imageObserver.unobserve(img)
          }
        })
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      },
    )

    // Find all images with data-src attribute
    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  } else {
    // Fallback for browsers that don't support Intersection Observer
    const lazyLoadImages = () => {
      const lazyImages = document.querySelectorAll("img[data-src]")

      lazyImages.forEach((imgNode) => {
        if (imgNode instanceof HTMLImageElement) { // Type check
          const img = imgNode as HTMLImageElement; // Cast after check
          if (isImageInViewport(img)) {
            const dataSrc = img.getAttribute("data-src")

            if (dataSrc) {
              img.src = dataSrc
              img.removeAttribute("data-src")
              img.classList.add("fade-in")
            }
          }
        }
      })

      // If all images are loaded, remove the scroll event listener
      // Note: lazyImages.length check might be misleading here if some are not HTMLImageElement
      // However, querySelectorAll("img[data-src]") should only return img elements.
      // For robustness, one might filter for HTMLImageElement first.
      if (document.querySelectorAll("img[data-src]").length === 0) { // Re-query to check if all processed
        document.removeEventListener("scroll", lazyLoadThrottled);
        if (typeof globalThis.window !== "undefined") {
          const win = globalThis.window as Window;
          win.removeEventListener("resize", lazyLoadThrottled);
          win.removeEventListener("orientationChange", lazyLoadThrottled);
        }
      }
    }

    // Throttle function to limit how often the lazy load function runs
    const throttle = (func: () => void, limit: number): (() => void) => { // Improved type signature
      let inThrottle: boolean;
      return () => {
        if (!inThrottle) {
          func();
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    // Throttled version of lazyLoadImages
    const lazyLoadThrottled = throttle(lazyLoadImages, 200)

    // Add event listeners
    document.addEventListener("scroll", lazyLoadThrottled)
    // Using globalThis for more robust window access in potentially complex type environments
    if (typeof globalThis.window !== "undefined") {
      const win = globalThis.window as Window;
      win.addEventListener("resize", lazyLoadThrottled);
      win.addEventListener("orientationChange", lazyLoadThrottled);
    }

    // Initial load
    lazyLoadImages()
  }
}

// Function to optimize image loading
export function optimizeImage(url: string, width?: number, quality?: number): string {
  if (!url) return url

  // If it's already a data URL or SVG, return as is
  if (url.startsWith("data:") || url.includes("placeholder.svg")) {
    return url
  }

  // Default values
  const imageWidth = width || 800
  const imageQuality = quality || 75

  // If URL is from an image optimization service or already has parameters, return as is
  if (url.includes("?") && (url.includes("width=") || url.includes("w="))) {
    return url
  }

  // Add parameters for optimization
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}width=${imageWidth}&quality=${imageQuality}&auto=format`
}

// Function to preload critical images
export function preloadCriticalImages(urls: string[]) {
  if (typeof window === "undefined") return

  urls.forEach((url) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = url
    document.head.appendChild(link)
  })
}

// Function to generate a placeholder for an image
export function generatePlaceholder(width: number, height: number, text?: string): string {
  const aspectRatio = height / width
  const calculatedHeight = Math.round(width * aspectRatio)

  return `/placeholder.svg?height=${calculatedHeight}&width=${width}&text=${encodeURIComponent(text || "")}`
}
