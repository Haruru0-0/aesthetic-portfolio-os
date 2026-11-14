import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// Liquid-glass toggle: a frosted, blurred track with a bright rim, and a glossy bead for the thumb.
// Used inside glass panels (sound settings) so it matches the rest of the surface.
function GlassSwitch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="glass-switch"
      className={cn(
        "peer relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none",
        "border border-white/35 bg-white/15 backdrop-blur-md transition-colors duration-300",
        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-1px_3px_rgba(0,40,90,0.3),0_2px_8px_rgba(0,30,80,0.25)]",
        "data-[state=checked]:border-sky-100/60 data-[state=checked]:bg-sky-400/45",
        "focus-visible:ring-2 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="glass-switch-thumb"
        className={cn(
          "pointer-events-none block size-6 rounded-full bg-white/85 backdrop-blur-sm",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(80,140,200,0.25),0_2px_6px_rgba(0,30,80,0.4)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.3)]",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { GlassSwitch }
