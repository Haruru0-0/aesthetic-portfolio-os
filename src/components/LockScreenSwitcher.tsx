import { useEffect, useRef, useState } from "react"
import { Settings } from "lucide-react"
import { GlassPanel } from "@/components/GlassPanel"
import { WallpaperGrid } from "@/components/WallpaperGrid"
import { WallpaperRotationSettings } from "./WallpaperRotationSettings"
import { useAppSound } from "@/components/sound-context"
import type { WallpaperChoice } from "@/components/wallpaper-context"

// Lock screen wallpaper switcher: a settings button in the bottom-right corner that opens a glass panel
// with thumbnails. Clicks here must not reach the "click anywhere to unlock" handler of the screen.
export function LockScreenSwitcher({ choice, portrait, hidden }: { choice: WallpaperChoice; portrait: boolean; hidden?: boolean }) {
  const [open, setOpen] = useState(false)
  const { playClickSound } = useAppSound()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  useEffect(() => {
    if (hidden) setOpen(false)
  }, [hidden])

  if (hidden || choice.wallpapers.length === 0) return null

  return (
    <div
      ref={rootRef}
      className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-3"
      onClick={(e) => e.stopPropagation()}
    >
      {open && (
        <div className={`max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl ${portrait ? "w-64 max-w-[calc(100vw-2rem)]" : "w-80 max-w-[calc(100vw-2rem)]"}`}>
          <GlassPanel radius="1rem" contentClassName="p-3">
            <p className="mb-2 text-sm font-bold text-slate-100">Lock screen wallpaper</p>
            {portrait && <p className="mb-2 text-xs text-slate-200">Swipe to browse wallpapers.</p>}
            <WallpaperGrid choice={choice} portrait={portrait} className={portrait ? undefined : "-m-1 max-h-72 overflow-y-auto p-1"} />
            <WallpaperRotationSettings choice={choice} />
          </GlassPanel>
        </div>
      )}
      <button
        type="button"
        aria-label="Lock screen settings"
        aria-expanded={open}
        onClick={() => {
          playClickSound()
          setOpen((v) => !v)
        }}
        className="group cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
      >
        <GlassPanel radius="1.5rem" width="max-content" className="dock-glass" contentClassName="flex items-center justify-center p-2.5 text-white transition-[padding] duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] group-hover:p-3.5">
          <Settings className="size-5" aria-hidden="true" />
        </GlassPanel>
      </button>
    </div>
  )
}
