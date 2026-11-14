import type { WallpaperChoice } from "@/components/wallpaper-context"
import { useAppSound } from "@/components/sound-context"
import { cn } from "@/lib/utils"

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
  return (
    <div
      role="group"
      aria-label="Wallpaper choices"
      data-vaul-no-drag={portrait ? "" : undefined}
      className={cn(
        portrait
          ? "flex w-full min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain p-1 pb-3 [scrollbar-width:thin]"
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
              "flex cursor-pointer flex-col gap-1 rounded-lg p-1 text-left text-[11px] text-slate-100 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-200",
              portrait && "w-24 shrink-0 snap-start",
              selected ? "bg-white/25 ring-2 ring-sky-200" : "hover:bg-white/15"
            )}
          >
            <img src={w.thumbnailSrc ?? w.src} decoding="async" alt="" className={cn("w-full rounded-md object-cover", portrait ? "aspect-[9/16]" : "aspect-video")} />
            <span className="w-full min-w-0 truncate" title={w.name}>{w.name}</span>
          </button>
        )
      })}
    </div>
  )
}
