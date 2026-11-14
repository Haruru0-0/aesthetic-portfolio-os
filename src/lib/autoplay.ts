import Autoplay from "embla-carousel-autoplay"

// Carousel autoplay that a visitor can stop: pauses on hover and on any
// interaction, and is off entirely when the OS asks for reduced motion.
export function createAutoplay(delay = 5000) {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return []
  }
  return [Autoplay({ delay, stopOnInteraction: true, stopOnMouseEnter: true })]
}
