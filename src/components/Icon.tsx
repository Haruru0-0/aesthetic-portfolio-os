import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useEffect, useRef } from "react"
import { useAppSound } from "./sound-context"
import { WallpaperText } from "./WallpaperText"
import { motion, useReducedMotion } from "motion/react"

export function DesktopIcon({
  id,
  label,
  icon,
  onDoubleClick,
  onSelect,
  isSelected = false,
  isBeingDragged = false,
}: { id: string; label: string; icon: string; onDoubleClick: () => void; onSelect?: () => void; isSelected?: boolean; isBeingDragged?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const iconRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const { playClickSound, playHoverSound } = useAppSound()
  const reducedMotion = useReducedMotion()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.()
  }

  const handleDoubleClick = () => {
    playClickSound()
    onDoubleClick()
  }

  const handleMouseEnter = () => {
    playHoverSound()

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.06,
        rotation: 0,
        overwrite: "auto",
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleMouseLeave = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        rotation: 0,
        overwrite: "auto",
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleMouseDown = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 0.94,
        overwrite: "auto",
        duration: 0.1,
        ease: "power2.out"
      })
    }
  }

  const handleMouseUp = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.06,
        overwrite: "auto",
        duration: 0.1,
        ease: "power2.out"
      })
    }
  }

  useEffect(() => {
    if (isBeingDragged && iconRef.current) {
      gsap.to(iconRef.current, { scale: 1, rotation: 0, duration: 0.1 });
    }
  }, [isBeingDragged]);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (iconRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(iconRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
      } else {
        gsap.fromTo(iconRef.current,
          { scale: 0.8, opacity: 0, y: 10 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: Math.random() * 0.3,
            ease: "back.out(1.7)"
          }
        );
      }
    }
  }, []);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`Open ${label}`}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleDoubleClick(); } }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isBeingDragged ? 0.3 : 1,
      }}
      className={`liquidGlass-icon desktop-icon w-20 sm:w-24 md:w-28 min-h-24 p-2 cursor-grab active:cursor-grabbing select-none pointer-events-auto ${isSelected ? "desktop-icon-selected" : ""}`}
    >
      <div className="liquidGlass-effect"></div>
      <div className="liquidGlass-tint"></div>
      <div className="liquidGlass-shine"></div>
      {isSelected && !isBeingDragged && (
        <motion.div
          aria-hidden="true"
          data-app-icon-selection=""
          layoutId="desktop-app-icon-selection"
          initial={false}
          transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 z-[5] rounded-[inherit]"
          style={{ boxShadow: "inset 0 0 0 2px var(--accent-color)" }}
        />
      )}
      <div className="liquidGlass-content">
        <div
          ref={iconRef}
          className="w-12 h-12 flex items-center justify-center"
        >
          <img
            src={icon || "/placeholder.svg"}
            alt=""
            className="max-w-full max-h-full object-contain drop-shadow-md"
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          />
        </div>
        <span
          ref={textRef}
          className={`desktop-icon-text${isSelected ? " desktop-icon-text-selected" : ""}`}
        >
          <WallpaperText positionKey={CSS.Transform.toString(transform)}>{label}</WallpaperText>
        </span>
      </div>
    </div>
  )
}
