import { createContext, useContext, type RefObject } from "react"
import type { Wallpaper } from "@/lib/wallpapers"

// Gives glass panels the real wallpaper <img>, so GlassSurface can refract it with WebGL
// in browsers without SVG backdrop filters (Firefox/Zen, Safari).
export const WallpaperContext = createContext<RefObject<HTMLImageElement | null> | null>(null)

export function useWallpaper() {
  return useContext(WallpaperContext)
}

// Which desktop wallpaper is selected, and how to change it (palette and right-click menu).
export type WallpaperChoice = {
  wallpapers: Wallpaper[]
  current: Wallpaper | undefined
  select: (id: string) => void
  next: () => void
  /** The lock screen wallpaper set for the same device. */
  lock?: WallpaperChoice
}

export const WallpaperChoiceContext = createContext<WallpaperChoice | null>(null)

export function useWallpaperChoice() {
  return useContext(WallpaperChoiceContext)
}
