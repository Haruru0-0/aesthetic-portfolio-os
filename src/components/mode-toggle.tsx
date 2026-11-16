import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useTheme } from "@/components/theme-provider"
import { useMediaQuery } from "@/hooks/use-media-query"
import { GlassPanel } from "@/components/GlassPanel"
import { IconTile } from "@/components/IconTile"

const itemClass = "w-full cursor-pointer hover:bg-sky-400/30 focus:bg-sky-400/30 text-slate-200 focus:text-slate-200"
const iconClass = "h-4 w-4 mr-2 text-slate-200"

function ModeContent({ onSelect, current }: { onSelect: (theme: "light" | "dark" | "system") => void; current: string }) {
  return (
    <GlassPanel radius="0.75rem" contentClassName="p-2">
        <div onClick={() => onSelect("light" as const)} className={`${itemClass} flex items-center p-2 rounded-sm`}>
          <Sun className={iconClass} /> Light
          {current === "light" && <Check className="ml-auto h-4 w-4" aria-label="Current theme" />}
        </div>
        <div onClick={() => onSelect("dark" as const)} className={`${itemClass} flex items-center p-2 rounded-sm`}>
          <Moon className={iconClass} /> Dark
          {current === "dark" && <Check className="ml-auto h-4 w-4" aria-label="Current theme" />}
        </div>
        <div onClick={() => onSelect("system" as const)} className={`${itemClass} flex items-center p-2 rounded-sm`}>
          <Monitor className={iconClass} /> System
          {current === "system" && <Check className="ml-auto h-4 w-4" aria-label="Current theme" />}
        </div>
    </GlassPanel>
  )
}

export function ModeToggle({ variant = "icon" }: { variant?: "icon" | "tile" } = {}) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const TriggerButton = variant === "tile" ? (
    <IconTile
      icon={theme === "light" ? <Sun aria-hidden="true" /> : theme === "dark" ? <Moon aria-hidden="true" /> : <Monitor aria-hidden="true" />}
      label="Theme"
    />
  ) : (
    <button className="glass-icon-control relative cursor-pointer flex items-center justify-center w-8 h-8 text-slate-200">
      <Sun className={`h-4 w-4 transition-all ${theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
      <Moon className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
      <Monitor className={`absolute h-4 w-4 transition-all ${theme === "system" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
      <span className="sr-only">Toggle theme</span>
    </button>
  )

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{TriggerButton}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 p-0 bg-transparent border-none shadow-none z-50">
          <GlassPanel radius="0.75rem" contentClassName="p-2">
              <DropdownMenuItem onClick={() => setTheme("light")} className={itemClass}>
                <Sun className={iconClass} /> Light
                {theme === "light" && <Check className="ml-auto h-4 w-4" aria-label="Current theme" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className={itemClass}>
                <Moon className={iconClass} /> Dark
                {theme === "dark" && <Check className="ml-auto h-4 w-4" aria-label="Current theme" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className={itemClass}>
                <Monitor className={iconClass} /> System
                {theme === "system" && <Check className="ml-auto h-4 w-4" aria-label="Current theme" />}
              </DropdownMenuItem>
          </GlassPanel>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent className="bg-transparent border-none shadow-none">
        <div className="mx-auto w-full max-w-sm p-4">
          <ModeContent onSelect={setTheme} current={theme} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
