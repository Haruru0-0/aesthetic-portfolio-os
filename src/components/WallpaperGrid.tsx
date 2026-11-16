import type { WallpaperChoice } from "@/components/wallpaper-context"
import { useAppSound } from "@/components/sound-context"
import { cn } from "@/lib/utils"
import { useId } from "react"
import { motion, useReducedMotion } from "motion/react"

// Portrait choices stay in a swipeable row; landscape choices use a grid.
export function WallpaperGrid({
  choice,
  portrait,
  onPick,
  className,
}: {
  choice: WallpaperChoice
  portrait: boolean
  onPick?: () => void
  className?: string
}) {
  const { playClickSound } = useAppSound()
  const selectionId = useId()
  const reducedMotion = useReducedMotion()
  return (
    <motion.div
      layoutScroll
      role="group"
      aria-label="Wallpaper choices"
      data-vaul-no-drag={portrait ? "" : undefined}
      className={cn(
        portrait
          ? "flex w-full min-w-0 snap-x snap-mandatory scroll-px-1 gap-2 overflow-x-auto overscroll-x-contain p-1 pb-3 [scrollbar-width:thin]"
          : "grid grid-cols-2 gap-2",
        className
      )}
    >
      {choice.wallpapers.map((w) => {
        const selected = choice.current?.id === w.id
        return (
          <button
            key={w.id}
            type="button"
            aria-pressed={selected}
            onClick={() => {
              playClickSound()
              choice.select(w.id)
              onPick?.()
            }}
            className={cn(
              "relative isolate flex cursor-pointer flex-col gap-1 rounded-lg p-1 text-left text-[11px] text-slate-100 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-200",
              portrait && "w-24 shrink-0 snap-start",
              !selected && "hover:bg-white/15"
            )}
          >
            {selected && (
              <motion.span
                aria-hidden="true"
                data-wallpaper-selection=""
                layoutId={`wallpaper-selection-${selectionId}`}
                initial={false}
                transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute inset-0 rounded-lg bg-white/25 ring-2 ring-sky-200"
              />
            )}
            <img src={w.thumbnailSrc ?? w.src} decoding="async" alt="" className={cn("relative z-10 w-full rounded-md object-cover", portrait ? "aspect-[9/16]" : "aspect-video")} />
            <span className="relative z-10 w-full min-w-0 truncate" title={w.name}>{w.name}</span>
          </button>
        )
      })}
    </motion.div>
  )
}
