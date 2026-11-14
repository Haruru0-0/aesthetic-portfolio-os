import { useState } from "react"
import { getWallpapers, readStoredWallpaperId, storeWallpaperId, type WallpaperKind } from "@/lib/wallpapers"
import type { WallpaperChoice } from "@/components/wallpaper-context"

// The selected wallpaper of one set (desktop/mobile, home/lock), remembered in the browser.
export function useWallpaperSelection(kind: WallpaperKind): WallpaperChoice {
  const wallpapers = getWallpapers(kind)
  const [id, setId] = useState(() => readStoredWallpaperId(kind))
  const current = wallpapers.find((w) => w.id === id) ?? wallpapers[0]

  const select = (next: string) => {
    setId(next)
    storeWallpaperId(next, kind)
  }
  const next = () => {
    if (wallpapers.length < 2) return
    const i = wallpapers.findIndex((w) => w.id === current?.id)
    select(wallpapers[(i + 1) % wallpapers.length].id)
  }

  return { wallpapers, current, select, next }
}
