export const APP_NAMES = ['About me', 'Resume', 'Projects', 'Blog', 'Links', 'Contact me', 'Achievements', 'Terminal'] as const
export type DesktopSession = { windows: { name: string; minimized: boolean }[]; focused: string | null }
export const SESSION_KEY = 'portfolio-desktop-session-v1'

export function readDesktopSession(): DesktopSession {
  try {
    const data = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')
    const seen = new Set<string>()
    const windows = (Array.isArray(data?.windows) ? data.windows : []).filter((item: unknown): item is { name: string; minimized: boolean } => {
      if (!item || typeof item !== 'object') return false
      const value = item as { name?: string; minimized?: boolean }
      if (!APP_NAMES.includes(value.name as typeof APP_NAMES[number]) || seen.has(value.name!)) return false
      seen.add(value.name!)
      return true
    }).map((item: { name: string; minimized: boolean }) => ({ name: item.name, minimized: item.minimized === true }))
    return { windows, focused: windows.some((item: { name: string; minimized: boolean }) => item.name === data?.focused && !item.minimized) ? data.focused : windows.find((item: { minimized: boolean }) => !item.minimized)?.name ?? null }
  } catch { return { windows: [], focused: null } }
}

export function saveDesktopSession(session: DesktopSession) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)) } catch { /* Browsing remains usable without storage. */ }
}

export type WindowLayout = { position: { x: number; y: number }; size: { width: number; height: number }; maximized: boolean; snap: string | null }
const SNAP_TYPES = new Set(['left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-wide', 'right-narrow', 'three-col-left', 'three-col-center', 'three-col-right', 'four-grid-top-left', 'four-grid-top-right', 'four-grid-bottom-left', 'four-grid-bottom-right', 'left-half-right-top', 'left-half-right-bottom', 'center-wide-left', 'center-wide-center', 'center-wide-right'])
export const layoutKey = (title: string) => `portfolio-window-layout-v1:${title}`

export function readWindowLayout(title: string, viewport: { width: number; height: number }): WindowLayout | null {
  try {
    const data = JSON.parse(localStorage.getItem(layoutKey(title)) ?? 'null')
    if (![data?.position?.x, data?.position?.y, data?.size?.width, data?.size?.height].every(value => typeof value === 'number' && Number.isFinite(value))) return null
    const width = Math.min(Math.max(350, data.size.width), Math.max(350, viewport.width - 20))
    const height = Math.min(Math.max(300, data.size.height), Math.max(300, viewport.height - 60))
    return { position: { x: Math.max(0, Math.min(data.position.x, viewport.width - width)), y: Math.max(40, Math.min(data.position.y, viewport.height - height)) }, size: { width, height }, maximized: data.maximized === true, snap: SNAP_TYPES.has(data.snap) ? data.snap : null }
  } catch { return null }
}

export function saveWindowLayout(title: string, layout: WindowLayout) {
  try { localStorage.setItem(layoutKey(title), JSON.stringify(layout)) } catch { /* Optional preference. */ }
}
