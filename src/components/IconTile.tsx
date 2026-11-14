import { forwardRef, useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { useAppSound } from "@/components/sound-context"
import { cn } from "@/lib/utils"

// A control tile that behaves like the home-screen app icons: transparent until hovered, then a glass
// card fades in, the icon grows on hover and shrinks while pressed, with the same sounds and label style.
export const IconTile = forwardRef<
  HTMLButtonElement,
  { icon: ReactNode; label: string } & Omit<React.ComponentProps<"button">, "children">
>(function IconTile({ icon, label, className, onClick, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, ...props }, ref) {
  const { playClickSound, playHoverSound } = useAppSound()
  const iconRef = useRef<HTMLDivElement>(null)

  const scaleTo = (scale: number, duration: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (iconRef.current) gsap.to(iconRef.current, { scale, duration, ease: "power2.out" })
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn("liquidGlass-icon desktop-icon flex h-[62px] w-full cursor-pointer select-none p-0", className)}
      onClick={(e) => {
        playClickSound()
        onClick?.(e)
      }}
      onMouseEnter={(e) => {
        playHoverSound()
        scaleTo(1.1, 0.2)
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        scaleTo(1, 0.2)
        onMouseLeave?.(e)
      }}
      onMouseDown={(e) => {
        scaleTo(0.9, 0.1)
        onMouseDown?.(e)
      }}
      onMouseUp={(e) => {
        scaleTo(1.1, 0.1)
        onMouseUp?.(e)
      }}
      {...props}
    >
      <div className="liquidGlass-effect" />
      <div className="liquidGlass-tint" />
      <div className="liquidGlass-shine" />
      <div className="liquidGlass-content">
        <div ref={iconRef} className="flex size-7 items-center justify-center text-white drop-shadow-md [&_svg]:size-6">
          {icon}
        </div>
        <span className="desktop-icon-text !mt-0.5 !px-0 !py-0 text-[10px] leading-tight">{label}</span>
      </div>
    </button>
  )
})
