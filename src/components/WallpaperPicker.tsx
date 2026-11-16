import { useState } from "react"
import { Image as ImageIcon } from "lucide-react"
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { GlassPanel } from "@/components/GlassPanel"
import { IconTile } from "@/components/IconTile"
import { useWallpaperChoice } from "@/components/wallpaper-context"
import { WallpaperGrid } from "@/components/WallpaperGrid"
import { cn } from "@/lib/utils"
import { WallpaperRotationSettings } from "./WallpaperRotationSettings"

// Mobile wallpaper picker: a tile that opens a glass sheet with a thumbnail for each wallpaper.
export function WallpaperPicker() {
  const choice = useWallpaperChoice()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"home" | "lock">("home")

  if (!choice) return null
  const active = tab === "lock" && choice.lock ? choice.lock : choice

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <IconTile icon={<ImageIcon aria-hidden="true" />} label="Wallpaper" />
      </DrawerTrigger>
      <DrawerContent className="max-h-[90dvh] overflow-y-auto border-none bg-transparent shadow-none">
        <div className="mx-auto w-full min-w-0 max-w-sm p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <GlassPanel radius="1rem" contentClassName="p-4">
            <DrawerTitle className="mb-1 text-base font-bold text-slate-100">Wallpaper</DrawerTitle>
            <DrawerDescription className="mb-3 text-xs text-slate-200">
              {tab === "lock" ? "Pick a background for your lock screen." : "Pick a background for your home screen."}
            </DrawerDescription>
            {choice.lock && (
              <div role="tablist" aria-label="Wallpaper for" className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-black/20 p-1">
                {(["home", "lock"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "cursor-pointer rounded-lg py-1.5 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-200",
                      tab === t ? "bg-white/25 text-white" : "text-slate-200 hover:bg-white/10"
                    )}
                  >
                    {t === "home" ? "Home screen" : "Lock screen"}
                  </button>
                ))}
              </div>
            )}
            <p className="mb-2 text-xs text-slate-200">Swipe to browse wallpapers.</p>
            <WallpaperGrid key={tab} choice={active} portrait onPick={() => setOpen(false)} />
            <WallpaperRotationSettings choice={active} />
          </GlassPanel>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
