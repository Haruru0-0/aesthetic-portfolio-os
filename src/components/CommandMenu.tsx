import { useEffect } from "react"
import { toast } from "sonner"
import { Check, Download, Image as ImageIcon, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { GlassPanel } from "@/components/GlassPanel"
import { PROFILE } from "@/data/profile"
import { useWallpaperChoice } from "@/components/wallpaper-context"

type AppItem = { id: string; label: string; icon: string }

const itemClass =
  "gap-3 px-3 py-2.5 text-slate-100 data-[selected=true]:bg-white/20 data-[selected=true]:text-white [&_svg]:text-slate-200"

export function CommandMenu({
  open,
  onOpenChange,
  apps,
  onOpenApp,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  apps: AppItem[]
  onOpenApp: (label: string) => void
}) {
  const wallpaper = useWallpaperChoice()

  // Ctrl/Cmd + K toggles the palette from anywhere on the desktop.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  const run = (action: () => void) => {
    onOpenChange(false)
    action()
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      toast.success("Email copied", { description: PROFILE.email })
    } catch {
      toast.error("Could not copy", { description: `Write to ${PROFILE.email}` })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[22%] max-w-xl translate-y-0 rounded-[1.25rem] border-0 bg-transparent p-0 shadow-[0_30px_90px_rgba(0,15,50,0.7)] sm:max-w-xl"
        onContextMenu={(e) => e.stopPropagation()}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">Search for an app or action</DialogDescription>
        <GlassPanel radius="1.25rem" className="border border-white/40" contentClassName="bg-[rgba(12,55,115,0.62)] p-2">
          <Command className="bg-transparent text-slate-100">
            <div className="[&_[data-slot=command-input-wrapper]]:h-12 [&_[data-slot=command-input-wrapper]]:border-white/25 [&_[data-slot=command-input-wrapper]_svg]:text-slate-100 [&_[data-slot=command-input-wrapper]_svg]:opacity-80">
              <CommandInput
                placeholder="Open an app or run a command..."
                className="text-base text-white placeholder:text-slate-200/80"
              />
            </div>
            <CommandList className="max-h-80 p-1">
              <CommandEmpty className="py-6 text-center text-sm text-slate-100">No results found.</CommandEmpty>
              <CommandGroup
                heading="Open"
                className="[&_[cmdk-group-heading]]:text-slate-200 [&_[cmdk-group-heading]]:text-xs"
              >
                {apps.map((app) => (
                  <CommandItem
                    key={app.id}
                    value={`open ${app.label}`}
                    className={itemClass}
                    onSelect={() => run(() => onOpenApp(app.label))}
                  >
                    <img src={app.icon} alt="" className="size-5 object-contain" />
                    {app.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator className="bg-white/25" />
              <CommandGroup
                heading="Actions"
                className="[&_[cmdk-group-heading]]:text-slate-200 [&_[cmdk-group-heading]]:text-xs"
              >
                <CommandItem value="copy email address" className={itemClass} onSelect={() => run(copyEmail)}>
                  <Mail />
                  Copy email address
                </CommandItem>
                <CommandItem
                  value="download resume pdf"
                  className={itemClass}
                  onSelect={() =>
                    run(() => {
                      const a = document.createElement("a")
                      a.href = PROFILE.resumePdf
                      a.download = ""
                      a.click()
                    })
                  }
                >
                  <Download />
                  Download resume (PDF)
                </CommandItem>
              </CommandGroup>
              {wallpaper && wallpaper.wallpapers.length > 0 && (
                <>
                  <CommandSeparator className="bg-white/25" />
                  <CommandGroup
                    heading="Wallpaper"
                    className="[&_[cmdk-group-heading]]:text-slate-200 [&_[cmdk-group-heading]]:text-xs"
                  >
                    {wallpaper.wallpapers.length > 1 && (
                      <CommandItem value="next wallpaper change background" className={itemClass} onSelect={() => run(wallpaper.next)}>
                        <ImageIcon />
                        Next wallpaper
                      </CommandItem>
                    )}
                    {wallpaper.wallpapers.map((w) => (
                      <CommandItem
                        key={w.id}
                        value={`wallpaper ${w.name}`}
                        className={itemClass}
                        onSelect={() => run(() => wallpaper.select(w.id))}
                      >
                        <img src={w.thumbnailSrc ?? w.src} decoding="async" alt="" className="h-7 w-12 shrink-0 rounded-md object-cover ring-1 ring-white/25" />
                        <span className="min-w-0 flex-1 truncate">{w.name}</span>
                        {wallpaper.current?.id === w.id && <Check className="ml-auto" aria-label="Current wallpaper" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
              {wallpaper?.lock && wallpaper.lock.wallpapers.length > 0 && (
                <>
                  <CommandSeparator className="bg-white/25" />
                  <CommandGroup
                    heading="Lock screen"
                    className="[&_[cmdk-group-heading]]:text-slate-200 [&_[cmdk-group-heading]]:text-xs"
                  >
                    {wallpaper.lock.wallpapers.map((w) => (
                      <CommandItem
                        key={w.id}
                        value={`lock screen ${w.name}`}
                        className={itemClass}
                        onSelect={() => run(() => wallpaper.lock?.select(w.id))}
                      >
                        <img src={w.thumbnailSrc ?? w.src} decoding="async" alt="" className="h-7 w-12 shrink-0 rounded-md object-cover ring-1 ring-white/25" />
                        <span className="min-w-0 flex-1 truncate">{w.name}</span>
                        {wallpaper.lock?.current?.id === w.id && <Check className="ml-auto" aria-label="Current lock screen" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </GlassPanel>
      </DialogContent>
    </Dialog>
  )
}
