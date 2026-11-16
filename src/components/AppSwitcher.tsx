import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog"
import { GlassPanel } from "./GlassPanel"

type SwitcherApp = { name: string; icon: string; minimized: boolean }
export function AppSwitcher({ open, onOpenChange, apps, activeName, onSelect, onSearch }: {
  open: boolean; onOpenChange: (open: boolean) => void; apps: SwitcherApp[]; activeName: string | null; onSelect: (name: string) => void; onSearch: () => void
}) {
  const [selected, setSelected] = useState(0)
  const keyboardSession = useRef(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const choose = (index: number) => {
    if (apps[index]) onSelect(apps[index].name)
    keyboardSession.current = false
    onOpenChange(false)
  }
  useEffect(() => {
    if (open && !keyboardSession.current) setSelected(Math.max(0, apps.findIndex(app => app.name === activeName)))
  }, [open])
  useEffect(() => {
    if (selected >= apps.length) setSelected(0)
  }, [apps.length, selected])
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.altKey && event.code === "Backquote" && apps.length) {
        event.preventDefault()
        keyboardSession.current = true
        const direction = event.shiftKey ? -1 : 1
        const current = Math.max(0, apps.findIndex(app => app.name === activeName))
        setSelected(value => ((open ? value : current) + direction + apps.length) % apps.length)
        onOpenChange(true)
      } else if (open && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) && apps.length) {
        event.preventDefault()
        const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1
        setSelected(value => (value + direction + apps.length) % apps.length)
      } else if (open && event.key === "Enter") {
        event.preventDefault(); choose(selected)
      }
    }
    const up = (event: KeyboardEvent) => {
      if (event.key === "Alt" && keyboardSession.current && open) choose(selected)
    }
    const blur = () => { if (keyboardSession.current) { keyboardSession.current = false; onOpenChange(false) } }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    window.addEventListener("blur", blur)
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur) }
  }, [open, selected, apps, activeName, onSelect, onOpenChange])
  return <Dialog open={open} onOpenChange={value => { if (!value) keyboardSession.current = false; onOpenChange(value) }}>
    <DialogContent ref={dialogRef} onOpenAutoFocus={event => { event.preventDefault(); dialogRef.current?.focus() }} className="max-w-[calc(100%-2rem)] rounded-[1.25rem] border-0 bg-transparent p-0 text-slate-100 shadow-none sm:max-w-xl" onCloseAutoFocus={event => event.preventDefault()}>
      <GlassPanel radius="1.25rem" tintColor="rgba(12,55,115,0.62)" contentClassName="p-5 text-slate-100 [text-shadow:0_1px_3px_rgba(0,15,50,0.9)]">
        <DialogTitle className="pr-8 text-xl font-bold text-white">Switch apps</DialogTitle>
        <DialogDescription className="mt-1 text-xs text-slate-200">Choose an open app.<span className="hidden sm:inline"> Use Alt + ` to cycle, then release Alt to switch.</span></DialogDescription>
        {apps.length ? <div className="mt-5 grid max-h-[60dvh] grid-cols-2 gap-3 overflow-y-auto p-1 sm:grid-cols-4" role="group" aria-label="Open apps">
          {apps.map((app, index) => <button key={app.name} type="button" aria-label={`Switch to ${app.name}`} aria-pressed={selected === index} onFocus={() => setSelected(index)} onClick={() => choose(index)} className="relative isolate flex cursor-pointer flex-col items-center gap-2 rounded-xl p-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-200">
            {selected === index && <motion.span data-app-switcher-selection="" layoutId="app-switcher-selection" initial={false} transition={{ duration: reduced ? 0 : .25 }} aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl bg-white/15 ring-1 ring-sky-200/60" />}
            <img src={app.icon} alt="" className="relative size-12 object-contain" />
            <span className="relative text-center">{app.name}</span>
            <span className="relative text-xs text-slate-200">{app.minimized ? "Minimized" : app.name === activeName ? "Active" : "Open"}</span>
          </button>)}
        </div> : <p className="py-8 text-center text-sm text-slate-200">Open an app to see it here.</p>}
        <button type="button" onClick={() => { onOpenChange(false); onSearch() }} className="mt-4 cursor-pointer rounded-lg border border-white/25 px-3 py-2 text-xs text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-200">Search all apps</button>
      </GlassPanel>
    </DialogContent>
  </Dialog>
}
