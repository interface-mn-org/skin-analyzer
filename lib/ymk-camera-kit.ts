/**
 * YouCam JS Camera Kit – dimension helper.
 * Computes width/height once for YMK.init() and #YMK-module container.
 * SDK allows 300–1920 for both.
 */

const MIN_DIM = 300
const MAX_DIM = 1920
const DEFAULT_WIDTH = 360
const DEFAULT_HEIGHT = 480
const DEFAULT_ASPECT = DEFAULT_HEIGHT / DEFAULT_WIDTH
const MOBILE_ASPECT = 1.5

export function getCameraKitDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }
  }
  const { innerWidth, innerHeight } = window
  const screenHeight = window.screen?.height ?? innerHeight

  let width: number
  let height: number

  if (innerWidth >= 500) {
    width = DEFAULT_WIDTH
    height = DEFAULT_HEIGHT
  } else {
    // Fit inside the DialogContent on small screens.
    // Base dialog max-width is ~ (viewport - 2rem) and we use `p-2` (8px padding each side),
    // so available inner width is approximately: innerWidth - 32 - 16 = innerWidth - 48.
    const availableWidth = innerWidth - 48
    width = Math.min(MAX_DIM, Math.max(MIN_DIM, availableWidth))
    if (availableWidth < MIN_DIM) {
      // Avoid horizontal overflow on very small screens.
      width = Math.max(1, Math.min(MAX_DIM, availableWidth))
    }

    // Keep a comfortable 3:4 ratio, but don't fill the entire screen height.
    const preferredHeight = Math.round(width * MOBILE_ASPECT)
    const maxHeight = Math.min(
      MAX_DIM,
      Math.max(MIN_DIM, Math.min(innerHeight, screenHeight) - 120),
    )
    height = Math.min(MAX_DIM, Math.max(MIN_DIM, Math.min(preferredHeight, maxHeight)))
  }

  return {
    width: Math.min(MAX_DIM, Math.max(1, width)),
    height: Math.min(MAX_DIM, Math.max(1, height)),
  }
}
