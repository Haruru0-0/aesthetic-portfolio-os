import type * as React from "react"
import { cn } from "@/lib/utils"
import GlassSurface from "@/components/GlassSurface"
import { useWallpaper } from "@/components/wallpaper-context"

// The site's blue-tinted liquid-glass surface, built on @react-bits GlassSurface:
// real refraction in Chromium (SVG) and in Firefox/Zen and Safari (WebGL, fed by the
// wallpaper <img>), with a thin rim. `variant="classic"` is the old CSS glass.
// Firefox/Zen and Safari draw the refraction with WebGL, which already shows a strong edge band.
// Chromium uses the SVG filter, whose default band is much subtler, so it gets a stronger one.
const usesWebGl =
  typeof navigator !== "undefined" &&
  (/Firefox/.test(navigator.userAgent) || (/Safari/.test(navigator.userAgent) && !/Chrome|Chromium/.test(navigator.userAgent)))

export function GlassPanel({
  children,
  className,
  contentClassName,
  radius = "1.25rem",
  width = "100%",
  variant = "surface",
  tintOverRim = true,
  tintColor = "rgba(30,110,200,0.24)",
  ...props
}: React.ComponentProps<"div"> & {
  contentClassName?: string
  radius?: string
  width?: number | string
  variant?: "surface" | "classic"
  tintOverRim?: boolean
  tintColor?: string
}) {
  const wallpaper = useWallpaper()
  if (variant === "surface") {
    const px = Math.round(parseFloat(radius) * 16)
    return (
      <GlassSurface
        width={width}
        height="auto"
        borderRadius={px}
        blur={14}
        borderWidth={usesWebGl ? undefined : 0.12}
        distortionScale={usesWebGl ? undefined : -250}
        brightness={45}
        backgroundOpacity={0.1}
        saturation={1.4}
        backdrop={wallpaper}
        tintOverlay={tintOverRim ? tintColor : undefined}
        className={cn("!block", className)}
      >
        <div className={cn("w-full rounded-[inherit] text-left", !tintOverRim && "bg-[rgba(30,110,200,0.24)]", contentClassName)} {...props}>
          {children}
        </div>
      </GlassSurface>
    )
  }

  const layer = { borderRadius: radius }
  return (
    <div className={cn("liquidGlass-wrapper glass-panel", className)} style={layer} {...props}>
      <div className="liquidGlass-effect" style={layer} />
      <div className="liquidGlass-tint" style={layer} />
      <div className="liquidGlass-shine" style={layer} />
      <div className={cn("liquidGlass-content w-full", contentClassName)} style={{ display: "block" }}>
        {children}
      </div>
    </div>
  )
}
