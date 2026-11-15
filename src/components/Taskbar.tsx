"use client"

import type React from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { createContext, forwardRef, useCallback, useContext, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppSound } from "./sound-context"
import { GlassPanel } from "@/components/GlassPanel"

interface AppItem {
  id: string
  label: string
  icon: string
}

interface TaskbarProps {
  apps: AppItem[]
  overflowApps?: AppItem[]
  openWindows: {
    name: string
    minimized: boolean
    component?: React.ReactNode
  }[]
  onAppClick: (label: string) => void
  className?: string
}

// macOS-style dock magnification: each icon's size follows the cursor's distance along the dock,
// smoothed with a spring. The dock widens because the icons take real layout space.
const DOCK_BASE = 50
const DOCK_MAX = 84
const DOCK_RANGE = 150

const DockMouseContext = createContext<MotionValue<number> | null>(null)

const DockButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof motion.button>>(function DockButton(
  { style, ...props },
  forwardedRef
) {
  const mouseX = useContext(DockMouseContext)
  const idle = useMotionValue(Infinity)
  const nodeRef = useRef<HTMLButtonElement | null>(null)
  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      nodeRef.current = node
      if (typeof forwardedRef === "function") forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef]
  )
  const distance = useTransform(mouseX ?? idle, (x) => {
    const box = nodeRef.current?.getBoundingClientRect()
    return box ? x - box.x - box.width / 2 : Infinity
  })
  const raw = useTransform(distance, [-DOCK_RANGE, 0, DOCK_RANGE], [DOCK_BASE, DOCK_MAX, DOCK_BASE])
  const size = useSpring(raw, { mass: 0.1, stiffness: 150, damping: 12 })

  return <motion.button ref={setRef} style={{ ...style, width: size, height: size }} {...props} />
})

export function Taskbar({ apps, overflowApps, openWindows, onAppClick, className = "" }: TaskbarProps) {
  const { playClickSound, playHoverSound, playMenuSound } = useAppSound()
  const taskbarRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(Infinity)
  // Mouse and trackpad only, and not when the visitor asks for reduced motion.
  const [magnify] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  const handleAppClick = (label: string) => {
    playClickSound()
    onAppClick(label)
  }

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (taskbarRef.current && !prefersReducedMotion) {
      gsap.fromTo(taskbarRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.8, ease: "back.out(1.7)" }
      )
    }
  }, [])

  return (
    <div
      ref={taskbarRef}
      className={`fixed bottom-2 left-1/2 -translate-x-1/2 z-[60] ${className}`}
      style={{ width: "auto" }}
    >
      <GlassPanel radius="2rem" width="max-content" className="dock-glass" contentClassName="p-0">
          <DockMouseContext.Provider value={magnify ? mouseX : null}>
          <motion.div
            className={magnify ? "dock dock-magnify" : "dock"}
            onMouseMove={magnify ? (e) => mouseX.set(e.clientX) : undefined}
            onMouseLeave={magnify ? () => mouseX.set(Infinity) : undefined}
          >
            <TooltipProvider>
              {apps.map((app) => {
                const win = openWindows.find((w) => w.name === app.label)
                const isRunning = !!win
                const isMinimized = win?.minimized

                return (
                  <Tooltip key={app.id}>
                    <TooltipTrigger asChild>
                      <DockButton
                        className="dock-icon group relative"
                        onClick={() => handleAppClick(app.label)}
                        onMouseEnter={() => playHoverSound()}
                      >
                        <img src={app.icon || "/placeholder.svg"} alt={app.label} className="drop-shadow-lg" />
                        {isRunning && (
                          <div className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm ${isMinimized ? 'opacity-50' : 'opacity-100'}`} />
                        )}
                      </DockButton>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={20} className="taskbar-tooltip z-[80] border-0 bg-transparent p-0 shadow-none" showArrow={false}>
                      <GlassPanel radius="0.75rem" width="max-content" contentClassName="px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap [text-shadow:0_1px_3px_rgba(0,15,40,0.8)]">{app.label}</GlassPanel>
                    </TooltipContent>
                  </Tooltip>
                )
              })}

              {/* Overflow dropdown */}
              {overflowApps && overflowApps.length > 0 && (
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <DockButton
                          className="dock-icon group relative"
                          onClick={() => playMenuSound()}
                          onMouseEnter={() => playHoverSound()}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/80 text-xl font-bold leading-none tracking-widest select-none pb-1">
                              ···
                            </span>
                          </div>
                        </DockButton>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={20} className="taskbar-tooltip z-[80] border-0 bg-transparent p-0 shadow-none" showArrow={false}>
                      <GlassPanel radius="0.75rem" width="max-content" contentClassName="px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap [text-shadow:0_1px_3px_rgba(0,15,40,0.8)]">More</GlassPanel>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent
                    side="top"
                    sideOffset={12}
                    align="center"
                    className="!bg-transparent !border-none !p-0 !shadow-none !min-w-0 !overflow-visible"
                  >
                    <GlassPanel radius="1.25rem" width="max-content" contentClassName="p-0">
                        <div className="flex flex-col items-center gap-1 p-2">
                          {overflowApps.map((app) => {
                            const win = openWindows.find((w) => w.name === app.label)
                            const isRunning = !!win
                            const isMinimized = win?.minimized
                            return (
                              <Tooltip key={app.id}>
                                <TooltipTrigger asChild>
                                  <button
                                    className="dock-icon group relative"
                                    onClick={() => handleAppClick(app.label)}
                                    onMouseEnter={() => playHoverSound()}
                                  >
                                    <img src={app.icon || "/placeholder.svg"} alt={app.label} className="drop-shadow-lg" />
                                    {isRunning && (
                                      <div className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm ${isMinimized ? "opacity-50" : "opacity-100"}`} />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="left" sideOffset={16} className="taskbar-tooltip z-[80] border-0 bg-transparent p-0 shadow-none" showArrow={false}>
                                  <GlassPanel radius="0.75rem" width="max-content" contentClassName="px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap [text-shadow:0_1px_3px_rgba(0,15,40,0.8)]">{app.label}</GlassPanel>
                                </TooltipContent>
                              </Tooltip>
                            )
                          })}
                        </div>
                    </GlassPanel>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TooltipProvider>
          </motion.div>
          </DockMouseContext.Provider>
      </GlassPanel>
    </div>
  )
}
