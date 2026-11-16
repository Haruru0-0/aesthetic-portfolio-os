import { useCallback, useEffect, useState } from "react"
import { getWallpapers, readStoredWallpaperId, storeWallpaperId, type WallpaperKind } from "@/lib/wallpapers"
import type { WallpaperChoice } from "@/components/wallpaper-context"
import { readRotationSettings, saveRotationSettings, ROTATION_INTERVALS } from "./wallpaper-rotation"

// The selected wallpaper of one set (desktop/mobile, home/lock), remembered in the browser.
export function useWallpaperSelection(kind: WallpaperKind, active = true): WallpaperChoice {
  const wallpapers = getWallpapers(kind)
  const [id, setId] = useState(() => readStoredWallpaperId(kind))
  const current = wallpapers.find((w) => w.id === id) ?? wallpapers[0]

  const [rotation, setRotation] = useState(() => readRotationSettings(kind))
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden")
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden")
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])
  useEffect(() => { saveRotationSettings(kind, rotation) }, [kind, rotation])

  const select = useCallback((next: string) => {
    if (!wallpapers.some(wallpaper => wallpaper.id === next)) return
    setId(next)
    storeWallpaperId(next, kind)
  }, [kind, wallpapers])
  const next = useCallback(() => {
    if (wallpapers.length < 2) return
    const i = wallpapers.findIndex((w) => w.id === current?.id)
    select(wallpapers[(i + 1) % wallpapers.length].id)
  }, [wallpapers, current?.id, select])
  useEffect(() => {
    if (!active || !visible || !rotation.enabled || wallpapers.length < 2) return
    const timer = window.setTimeout(next, rotation.intervalSeconds * 1000)
    return () => window.clearTimeout(timer)
  }, [active, visible, rotation.enabled, rotation.intervalSeconds, id, next, wallpapers.length])

  return { wallpapers, current, select, next, rotation: {
    ...rotation,
    setEnabled: enabled => setRotation(value => ({ ...value, enabled })),
    setIntervalSeconds: seconds => { if (ROTATION_INTERVALS.includes(seconds as typeof ROTATION_INTERVALS[number])) setRotation(value => ({ ...value, intervalSeconds: seconds })) },
  } }
}
