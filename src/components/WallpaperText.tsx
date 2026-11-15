import { useEffect, useRef, useState, type ReactNode } from "react";
import { useWallpaper, useWallpaperChoice } from "./wallpaper-context";

/** Contrast against the actual object-cover crop underneath this label. */
export function WallpaperText({ children, positionKey }: { children: ReactNode; positionKey?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const wallpaper = useWallpaper();
  const choice = useWallpaperChoice();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const image = wallpaper?.current;
    const label = ref.current;
    if (!image || !label) return;
    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 16;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    let frame = 0;
    const sample = () => {
      if (!image.complete || !image.naturalWidth) return;
      const backdrop = image.getBoundingClientRect();
      const text = label.getBoundingClientRect();
      if (!backdrop.width || !backdrop.height || !text.width || !text.height) return;
      const scale = Math.max(backdrop.width / image.naturalWidth, backdrop.height / image.naturalHeight);
      const cropX = (image.naturalWidth * scale - backdrop.width) / 2;
      const cropY = (image.naturalHeight * scale - backdrop.height) / 2;
      try {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image,
          (text.left - backdrop.left + cropX) / scale,
          (text.top - backdrop.top + cropY) / scale,
          text.width / scale, text.height / scale,
          0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const linear = (value: number) => {
          const c = value / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        };
        let luminance = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          luminance += 0.2126 * linear(pixels[i]) + 0.7152 * linear(pixels[i + 1]) + 0.0722 * linear(pixels[i + 2]);
        }
        setDark(luminance / (pixels.length / 4) > 0.179);
      } catch {
        setDark(false);
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sample);
    };
    image.addEventListener("load", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(image);
    observer.observe(label);
    // Sorting and dragging move labels without changing their dimensions.
    window.addEventListener("pointerup", schedule);
    window.addEventListener("keyup", schedule);
    window.addEventListener("transitionend", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      image.removeEventListener("load", schedule);
      window.removeEventListener("pointerup", schedule);
      window.removeEventListener("keyup", schedule);
      window.removeEventListener("transitionend", schedule);
    };
  }, [wallpaper, choice?.current?.src, positionKey, children]);

  return <span ref={ref} style={{
    color: dark ? "#102034" : "#ffffff",
    textShadow: dark ? "0 1px 3px rgba(255,255,255,0.7)" : "0 1px 3px rgba(0,15,40,0.8)",
    transition: "color 400ms ease, text-shadow 400ms ease",
  }}>{children}</span>;
}
