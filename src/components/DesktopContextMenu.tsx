import type * as React from "react"
import { ArrowDownAZ, Check, Command as CommandIcon, Image as ImageIcon, Monitor, Moon, RotateCcw, Sun, Volume2 } from "lucide-react"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { GlassPanel } from "@/components/GlassPanel"
import { useAppSound } from "@/components/sound-context"
import { useTheme } from "@/components/theme-provider"
import { useWallpaperChoice } from "@/components/wallpaper-context"
import { cn } from "@/lib/utils"

type AppItem = { id: string; label: string; icon: string }

const contentClass = "!min-w-0 w-72 !overflow-visible !border-none !bg-transparent !p-0 !shadow-none"
const itemClass =
  "gap-3 whitespace-nowrap px-3 py-2 text-slate-100 focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[state=open]:bg-white/20 [&>svg]:!text-slate-200"

// Reserve the trailing badge space so selection never shifts the menu labels.
const selectedMark =
  "group rounded-lg transition-colors data-[state=checked]:bg-sky-200/15 data-[state=checked]:shadow-[inset_0_0_0_1px_rgba(186,230,253,0.35)] [&>span:first-child]:hidden"

function SelectionBadge() {
  return (
    <span
      aria-hidden="true"
      className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-md bg-sky-200 opacity-0 transition-opacity group-data-[state=checked]:opacity-100"
    >
      <Check className="!size-3.5 !text-sky-950" strokeWidth={3} />
    </span>
  )
}

function GlassRadioItem({ children, className, ...props }: React.ComponentProps<typeof ContextMenuRadioItem>) {
  return (
    <ContextMenuRadioItem className={cn(itemClass, selectedMark, className)} {...props}>
      {children}
      <SelectionBadge />
    </ContextMenuRadioItem>
  )
}

function GlassCheckboxItem({ children, className, ...props }: React.ComponentProps<typeof ContextMenuCheckboxItem>) {
  return (
    <ContextMenuCheckboxItem className={cn(itemClass, selectedMark, className)} {...props}>
      {children}
      <SelectionBadge />
    </ContextMenuCheckboxItem>
  )
}

export function DesktopContextMenu({
  enabled,
  apps,
  onOpenApp,
  onOpenPalette,
  onSortApps,
  onResetApps,
  children,
}: {
  enabled: boolean
  apps: AppItem[]
  onOpenApp: (label: string) => void
  onOpenPalette: () => void
  onSortApps: () => void
  onResetApps: () => void
  children: React.ReactElement
}) {
  const { isSoundEnabled, setSoundEnabled, playClickSound } = useAppSound()
  const { theme, setTheme } = useTheme()
  const wallpaper = useWallpaperChoice()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild disabled={!enabled}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className={contentClass}>
        <GlassPanel radius="1rem" contentClassName="p-1.5">
          <ContextMenuLabel className="px-3 py-1.5 text-xs text-slate-200">Desktop</ContextMenuLabel>
          <ContextMenuSub>
            <ContextMenuSubTrigger className={itemClass}>Open app</ContextMenuSubTrigger>
            <ContextMenuSubContent className={contentClass}>
              <GlassPanel radius="1rem" contentClassName="p-1.5">
                {apps.map((app) => (
                  <ContextMenuItem key={app.id} className={itemClass} onSelect={() => onOpenApp(app.label)}>
                    <img src={app.icon} alt="" className="size-5 object-contain" />
                    {app.label}
                  </ContextMenuItem>
                ))}
              </GlassPanel>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem className={itemClass} onSelect={onOpenPalette}>
            <CommandIcon />
            Command palette
            <ContextMenuShortcut className="whitespace-nowrap text-slate-200">Ctrl K</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator className="bg-white/25" />
          <ContextMenuItem className={itemClass} onSelect={onSortApps}>
            <ArrowDownAZ />
            Sort icons A to Z
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={onResetApps}>
            <RotateCcw />
            Reset icon order
          </ContextMenuItem>
          {wallpaper && wallpaper.wallpapers.length > 0 && (
            <ContextMenuSub>
              <ContextMenuSubTrigger className={itemClass}>
                <ImageIcon />
                Wallpaper
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className={contentClass}>
                <GlassPanel radius="1rem" contentClassName="p-1.5">
                  {wallpaper.wallpapers.length > 1 && (
                    <>
                      <ContextMenuItem className={itemClass} onSelect={wallpaper.next}>
                        <ImageIcon />
                        Next wallpaper
                      </ContextMenuItem>
                      <ContextMenuSeparator className="bg-white/25" />
                    </>
                  )}
                  <ContextMenuRadioGroup value={wallpaper.current?.id} onValueChange={wallpaper.select}>
                    {wallpaper.wallpapers.map((w) => (
                      <GlassRadioItem key={w.id} value={w.id}>
                        <img src={w.thumbnailSrc ?? w.src} decoding="async" alt="" className="h-7 w-12 shrink-0 rounded-md object-cover ring-1 ring-white/25" />
                        <span className="min-w-0 flex-1 truncate">{w.name}</span>
                      </GlassRadioItem>
                    ))}
                  </ContextMenuRadioGroup>
                </GlassPanel>
              </ContextMenuSubContent>
            </ContextMenuSub>
          )}
          {wallpaper?.lock && wallpaper.lock.wallpapers.length > 0 && (
            <ContextMenuSub>
              <ContextMenuSubTrigger className={itemClass}>
                <ImageIcon />
                Lock screen
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className={contentClass}>
                <GlassPanel radius="1rem" contentClassName="p-1.5">
                  <ContextMenuRadioGroup value={wallpaper.lock.current?.id} onValueChange={wallpaper.lock.select}>
                    {wallpaper.lock.wallpapers.map((w) => (
                      <GlassRadioItem key={w.id} value={w.id}>
                        <img src={w.thumbnailSrc ?? w.src} decoding="async" alt="" className="h-7 w-12 shrink-0 rounded-md object-cover ring-1 ring-white/25" />
                        <span className="min-w-0 flex-1 truncate">{w.name}</span>
                      </GlassRadioItem>
                    ))}
                  </ContextMenuRadioGroup>
                </GlassPanel>
              </ContextMenuSubContent>
            </ContextMenuSub>
          )}
          <ContextMenuSeparator className="bg-white/25" />
          <GlassCheckboxItem
            checked={isSoundEnabled}
            onCheckedChange={(checked) => {
              setSoundEnabled(checked === true)
              if (checked === true) playClickSound()
            }}
          >
            <Volume2 />
            Retro sounds
          </GlassCheckboxItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger className={itemClass}>
              <Monitor />
              Theme
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className={contentClass}>
              <GlassPanel radius="1rem" contentClassName="p-1.5">
                <ContextMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}>
                  <GlassRadioItem value="light">
                    <Sun />
                    Light
                  </GlassRadioItem>
                  <GlassRadioItem value="dark">
                    <Moon />
                    Dark
                  </GlassRadioItem>
                  <GlassRadioItem value="system">
                    <Monitor />
                    System
                  </GlassRadioItem>
                </ContextMenuRadioGroup>
              </GlassPanel>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </GlassPanel>
      </ContextMenuContent>
    </ContextMenu>
  )
}
