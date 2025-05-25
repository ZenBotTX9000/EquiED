// Animation configuration for consistent, high-quality animations throughout the app

// Easing functions for natural-feeling animations
export const easings = {
  // Standard easings
  smooth: "power2.out",
  smoothIn: "power2.in",
  smoothInOut: "power2.inOut",

  // Bouncy easings
  bounce: "back.out(1.2)",
  bounceMild: "back.out(1.1)",
  bounceStrong: "back.out(1.4)",

  // Elastic easings
  elastic: "elastic.out(1, 0.3)",
  elasticMild: "elastic.out(1, 0.2)",

  // Specialized easings
  textReveal: "power3.out",
  buttonClick: "power3.inOut",
  dialogOpen: "power4.out",
  dialogClose: "power4.in",

  // Custom cubic-bezier easings
  custom1: "cubic-bezier(0.25, 1, 0.5, 1)",
  custom2: "cubic-bezier(0.34, 1.56, 0.64, 1)",
}

// Duration presets for consistent timing
export const durations = {
  ultraFast: 0.15,
  veryFast: 0.2,
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
  verySlow: 1,
  ultraSlow: 1.5,
}

// Animation presets for common elements
export const presets = {
  // Button animations
  buttonHover: {
    scale: 1.03,
    duration: durations.ultraFast,
    ease: easings.smooth,
  },
  buttonActive: {
    scale: 0.97,
    duration: durations.ultraFast,
    ease: easings.smooth,
  },

  // Message animations
  messageIn: {
    y: [20, 0],
    opacity: [0, 1],
    scale: [0.98, 1],
    duration: durations.normal,
    ease: easings.smooth,
    stagger: 0.08,
  },
  messageOut: {
    y: [-20, 0],
    opacity: [0, 1],
    scale: [0.98, 1],
    duration: durations.fast,
    ease: easings.smoothIn,
  },

  // Dialog animations
  dialogIn: {
    y: [10, 0],
    scale: [0.95, 1],
    opacity: [0, 1],
    duration: durations.normal,
    ease: easings.dialogOpen,
  },
  dialogOut: {
    y: [0, 10],
    scale: [1, 0.95],
    opacity: [1, 0],
    duration: durations.fast,
    ease: easings.dialogClose,
  },

  // Text animations
  textReveal: {
    y: [20, 0],
    opacity: [0, 1],
    duration: durations.normal,
    ease: easings.textReveal,
    stagger: 0.02,
  },

  // Scroll animations
  scrollFadeIn: {
    opacity: [0, 1],
    y: [30, 0],
    duration: durations.normal,
    ease: easings.smooth,
  },
}

// Device-specific animation adjustments
export const deviceAdjustments = {
  mobile: {
    // Reduce animation complexity on mobile
    durationMultiplier: 0.8,
    disableStagger: true,
    reduceMotion: {
      scale: false,
      duration: durations.ultraFast,
    },
  },
  lowPower: {
    // Minimal animations for low-power mode or reduced motion
    durationMultiplier: 0.5,
    disableStagger: true,
    disableScale: true,
    simplifyEasing: true,
  },
}

// Helper function to adjust animations based on device capabilities
export function adjustForDevice(preset: any, deviceType: "desktop" | "mobile" | "lowPower") {
  if (deviceType === "desktop") return preset

  const adjustment = deviceAdjustments[deviceType]
  const adjusted = { ...preset }

  if (adjusted.duration) {
    adjusted.duration *= adjustment.durationMultiplier
  }

  if (adjustment.disableStagger && adjusted.stagger) {
    adjusted.stagger = 0
  }

  if ("disableScale" in adjustment && adjustment.disableScale && adjusted.scale) {
    adjusted.scale = 1
  }

  if ("simplifyEasing" in adjustment && adjustment.simplifyEasing) {
    adjusted.ease = easings.smooth
  }

  return adjusted
}
