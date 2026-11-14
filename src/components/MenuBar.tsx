import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Search } from "lucide-react"
import { GlassPanel } from "@/components/GlassPanel"
import { ModeToggle } from "./mode-toggle"
import { SoundSettings } from "./sound-settings"
import HalloGif from "../assets/mascots/hallo.webp";

export default function MenuBar({ onOpenPalette }: { onOpenPalette?: () => void }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <GlassPanel
        radius="1.5rem"
        className="group !rounded-b-3xl !rounded-t-none"
        contentClassName="flex items-center justify-between px-4 py-2.5 text-lg font-medium transition-[padding] duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] group-hover:py-3.5"
        style={{ color: "var(--cute-text)" }}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-bold flex items-center">
              <img src={HalloGif} alt="Logo" className="h-7 w-8 mr-2" />
              <p className="text-slate-200">Ahmad kanaan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {onOpenPalette && (
              <button
                type="button"
                onClick={onOpenPalette}
                aria-label="Open command palette (Ctrl+K)"
                className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-sm text-slate-200 transition-colors hover:bg-white/10"
              >
                <Search className="size-4" aria-hidden="true" />
                <kbd className="hidden text-xs opacity-80 lg:inline">Ctrl K</kbd>
              </button>
            )}
            <SoundSettings />
            <ModeToggle />
            <span className="text-slate-200">{format(currentTime, "EEE d MMM h:mm a")}</span>
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}