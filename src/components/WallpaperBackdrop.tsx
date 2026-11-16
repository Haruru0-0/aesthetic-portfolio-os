import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react"

/** Keep the old wallpaper visible until its replacement is decoded and ready to glide. */
export function WallpaperBackdrop({ src, imageRef, active }: {
  src?: string
  imageRef: RefObject<HTMLImageElement | null>
  active: boolean
}) {
  const [frame, setFrame] = useState({ current: src, previous: undefined as string | undefined })
  const previousRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!src) return
    let cancelled = false
    const preload = new Image()
    preload.src = src
    void preload.decode().then(() => {
      if (cancelled) return
      setFrame(current => current.current === src ? current : { current: src, previous: current.current })
    }).catch(() => {
      // Keep the last successful wallpaper if the new asset cannot be loaded.
    })
    return () => { cancelled = true }
  }, [src])

  useLayoutEffect(() => {
    const incoming = imageRef.current
    const outgoing = previousRef.current
    if (!frame.previous || !incoming || !outgoing) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const options = { duration: reduced ? 150 : 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" as const }
    const enter = incoming.animate(reduced
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [{ transform: "translateX(100%)" }, { transform: "translateX(0)" }], options)
    const leave = outgoing.animate(reduced
      ? [{ opacity: 1 }, { opacity: 0 }]
      : [{ transform: "translateX(0)", opacity: 1 }, { transform: "translateX(-25%)", opacity: 0.65 }], options)
    void enter.finished.then(() => {
      setFrame(current => current.current === frame.current ? { current: current.current, previous: undefined } : current)
    }).catch(() => {})
    return () => { enter.cancel(); leave.cancel() }
  }, [frame.current, frame.previous, imageRef])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700" style={{ opacity: active ? 1 : 0 }}>
      {frame.previous && <img ref={previousRef} src={frame.previous} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none object-cover object-center" />}
      <img ref={imageRef} src={frame.current} alt="" draggable={false} data-wallpaper-current="" className="absolute inset-0 h-full w-full select-none object-cover object-center" />
    </div>
  )
}
