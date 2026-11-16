import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useWallpaperSelection } from './use-wallpaper-selection'
import { rotationKey } from './wallpaper-rotation'

vi.mock('./wallpapers', () => {
  const wallpapers = ['a', 'b', 'c'].map(id => ({ id, name: id, src: `${id}.webp` }))
  return { getWallpapers: () => wallpapers, readStoredWallpaperId: () => 'a', storeWallpaperId: vi.fn() }
})
let storage: Map<string, string>
beforeEach(() => {
  vi.useFakeTimers()
  storage = new Map()
  vi.stubGlobal('localStorage', { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) })
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers() })

it('rotates only after the chosen interval and persists the preference', () => {
  const { result } = renderHook(() => useWallpaperSelection('desktop'))
  act(() => { result.current.rotation!.setIntervalSeconds(30); result.current.rotation!.setEnabled(true) })
  act(() => vi.advanceTimersByTime(29999))
  expect(result.current.current?.id).toBe('a')
  act(() => vi.advanceTimersByTime(1))
  expect(result.current.current?.id).toBe('b')
  expect(JSON.parse(storage.get(rotationKey('desktop'))!)).toEqual({ enabled: true, intervalSeconds: 30 })
})
it('resets the timer after a manual choice and interval change', () => {
  const { result } = renderHook(() => useWallpaperSelection('desktop'))
  act(() => { result.current.rotation!.setIntervalSeconds(30); result.current.rotation!.setEnabled(true) })
  act(() => vi.advanceTimersByTime(15000))
  act(() => result.current.select('b'))
  act(() => vi.advanceTimersByTime(15000))
  expect(result.current.current?.id).toBe('b')
  act(() => result.current.rotation!.setIntervalSeconds(60))
  act(() => vi.advanceTimersByTime(59999))
  expect(result.current.current?.id).toBe('b')
  act(() => vi.advanceTimersByTime(1))
  expect(result.current.current?.id).toBe('c')
})
it('pauses hidden and inactive sets and cleans up timers on unmount', () => {
  storage.set(rotationKey('desktop'), JSON.stringify({ enabled: true, intervalSeconds: 30 }))
  const { result, rerender, unmount } = renderHook(({ active }) => useWallpaperSelection('desktop', active), { initialProps: { active: false } })
  act(() => vi.advanceTimersByTime(60000))
  expect(result.current.current?.id).toBe('a')
  rerender({ active: true })
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
  act(() => document.dispatchEvent(new Event('visibilitychange')))
  act(() => vi.advanceTimersByTime(60000))
  expect(result.current.current?.id).toBe('a')
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
  act(() => document.dispatchEvent(new Event('visibilitychange')))
  act(() => vi.advanceTimersByTime(30000))
  expect(result.current.current?.id).toBe('b')
  unmount()
  expect(vi.getTimerCount()).toBe(0)
})
it('falls back safely from an invalid timer preference', () => {
  storage.set(rotationKey('desktop'), JSON.stringify({ enabled: true, intervalSeconds: -1 }))
  const { result } = renderHook(() => useWallpaperSelection('desktop'))
  expect(result.current.rotation?.intervalSeconds).toBe(300)
})
