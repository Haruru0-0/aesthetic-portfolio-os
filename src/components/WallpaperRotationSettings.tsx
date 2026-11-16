import { useId } from "react"
import type { WallpaperChoice } from "./wallpaper-context"
import { GlassSwitch } from "./ui/glass-switch"
import { Timer } from "lucide-react"

const intervals = [
  { seconds: 30, label: "30 seconds", short: "30 sec" },
  { seconds: 60, label: "1 minute", short: "1 min" },
  { seconds: 300, label: "5 minutes", short: "5 min" },
  { seconds: 900, label: "15 minutes", short: "15 min" },
  { seconds: 1800, label: "30 minutes", short: "30 min" },
  { seconds: 3600, label: "1 hour", short: "1 hour" },
]

export function WallpaperRotationSettings({ choice }: { choice: WallpaperChoice }) {
  const id = useId()
  const rotation = choice.rotation
  if (!rotation || choice.wallpapers.length < 2) return null
  return (
    <div className="mt-4 space-y-4 border-t border-white/20 pt-4 text-xs text-slate-100">
      <div className="flex items-center justify-between gap-3">
        <label className="cursor-pointer font-semibold" htmlFor={`${id}-enabled`}>Change automatically</label>
        <GlassSwitch id={`${id}-enabled`} checked={rotation.enabled} onCheckedChange={rotation.setEnabled} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-200"><Timer className="size-3.5" aria-hidden="true" /><span id={`${id}-timer-label`}>Change every</span></div>
        <div role="radiogroup" aria-labelledby={`${id}-timer-label`} className="grid grid-cols-3 gap-2">
          {intervals.map(interval => <label key={interval.seconds} className="relative cursor-pointer">
            <input type="radio" name={`${id}-timer`} value={interval.seconds} checked={rotation.intervalSeconds === interval.seconds} onChange={() => rotation.setIntervalSeconds(interval.seconds)} aria-label={interval.label} className="peer sr-only" />
            <span className="flex min-h-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-1 py-2 text-xs text-slate-200 transition-colors hover:bg-white/15 peer-checked:border-sky-200/70 peer-checked:bg-sky-200/20 peer-checked:font-semibold peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-sky-200 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-transparent">{interval.short}</span>
          </label>)}
        </div>
      </div>
    </div>
  )
}
