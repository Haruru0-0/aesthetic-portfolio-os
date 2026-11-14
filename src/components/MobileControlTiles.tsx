"use client"

import { Search } from "lucide-react"
import { SoundSettings } from "./sound-settings"
import { ModeToggle } from "./mode-toggle"
import { WallpaperPicker } from "./WallpaperPicker"
import { IconTile } from "./IconTile"
import { GlassPanel } from "./GlassPanel"

// 2x2 control tiles for the mobile home screen: Sound, Theme, Wallpaper and Search (command palette).
export function MobileControlTiles({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <div className="flex h-full items-center justify-center">
      <GlassPanel radius="1rem" className="dock-glass" contentClassName="p-1">
        <div className="grid grid-cols-2 gap-0">
          <SoundSettings variant="tile" />
          <ModeToggle variant="tile" />
          <WallpaperPicker />
          <IconTile icon={<Search aria-hidden="true" />} label="Search" onClick={onOpenPalette} />
        </div>
      </GlassPanel>
    </div>
  )
}
