// Wallpapers for the home and lock screens, per device. Drop an image into the matching folder under
// src/assets/wallpapers/ and it shows up in the switchers automatically:
//   desktop/home  desktop/lock  mobile/home  mobile/lock   (mobile ones: portrait images)
// The file name becomes the label: "city-at-night.webp" -> "City At Night".

export type Wallpaper = { id: string; name: string; src: string; thumbnailSrc?: string }
export type WallpaperKind = "desktop" | "mobile" | "desktop-lock" | "mobile-lock"

// Vite needs the glob options written out literally (not through a variable).
const desktopFiles = import.meta.glob("../assets/wallpapers/desktop/home/*.{webp,avif,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>
const mobileFiles = import.meta.glob("../assets/wallpapers/mobile/home/*.{webp,avif,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>
const desktopLockFiles = import.meta.glob("../assets/wallpapers/desktop/lock/*.{webp,avif,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>
const mobileLockFiles = import.meta.glob("../assets/wallpapers/mobile/lock/*.{webp,avif,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

const thumbnails = import.meta.glob("../assets/wallpaper-thumbnails/*/*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

function prettify(id: string) {
  return id.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function build(files: Record<string, string>): Wallpaper[] {
  return Object.entries(files)
    .map(([path, src]) => {
      const id = path.split("/").pop()!.replace(/\.[^.]+$/, "")
      const thumbnailPath = path.replace("/wallpapers/", "/wallpaper-thumbnails/").replace(/\.[^.]+$/, ".webp")
      return { id, name: prettify(id), src, thumbnailSrc: thumbnails[thumbnailPath] ?? src }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const WALLPAPERS: Wallpaper[] = build(desktopFiles)
export const MOBILE_WALLPAPERS: Wallpaper[] = build(mobileFiles)
export const DESKTOP_LOCK_WALLPAPERS: Wallpaper[] = build(desktopLockFiles)
export const MOBILE_LOCK_WALLPAPERS: Wallpaper[] = build(mobileLockFiles)

const LISTS: Record<WallpaperKind, Wallpaper[]> = {
  desktop: WALLPAPERS,
  mobile: MOBILE_WALLPAPERS,
  "desktop-lock": DESKTOP_LOCK_WALLPAPERS,
  "mobile-lock": MOBILE_LOCK_WALLPAPERS,
}
const STORAGE_KEYS: Record<WallpaperKind, string> = {
  desktop: "portfolio-wallpaper",
  mobile: "portfolio-wallpaper-mobile",
  "desktop-lock": "portfolio-lockscreen",
  "mobile-lock": "portfolio-lockscreen-mobile",
}
// Used until the visitor picks one. Adding new files never changes it.
const DEFAULT_IDS: Record<WallpaperKind, string> = {
  desktop: "lilies-night",
  mobile: "jellyfish",
  "desktop-lock": "blossom-streetlight",
  "mobile-lock": "blossom-street",
}

export function getWallpapers(kind: WallpaperKind): Wallpaper[] {
  return LISTS[kind]
}

export function readStoredWallpaperId(kind: WallpaperKind = "desktop"): string {
  const list = LISTS[kind]
  try {
    const saved = localStorage.getItem(STORAGE_KEYS[kind])
    if (saved && list.some((w) => w.id === saved)) return saved
  } catch {
    /* storage can be blocked; fall back to the default */
  }
  return list.find((w) => w.id === DEFAULT_IDS[kind])?.id ?? list[0]?.id ?? ""
}

export function storeWallpaperId(id: string, kind: WallpaperKind = "desktop") {
  try {
    localStorage.setItem(STORAGE_KEYS[kind], id)
  } catch {
    /* ignore */
  }
}
