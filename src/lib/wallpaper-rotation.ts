export const ROTATION_INTERVALS = [30, 60, 300, 900, 1800, 3600] as const
export type RotationSettings = { enabled: boolean; intervalSeconds: number }
export const rotationKey = (kind: string) => `portfolio-wallpaper-rotation:${kind}`
export function readRotationSettings(kind: string): RotationSettings {
  try {
    const value = JSON.parse(localStorage.getItem(rotationKey(kind)) ?? 'null')
    return { enabled: value?.enabled === true, intervalSeconds: ROTATION_INTERVALS.includes(value?.intervalSeconds) ? value.intervalSeconds : 300 }
  } catch { return { enabled: false, intervalSeconds: 300 } }
}
export function saveRotationSettings(kind: string, value: RotationSettings) {
  try { localStorage.setItem(rotationKey(kind), JSON.stringify(value)) } catch { /* Optional preference. */ }
}
