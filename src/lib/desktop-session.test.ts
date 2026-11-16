import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { layoutKey, readDesktopSession, readWindowLayout, saveDesktopSession, saveWindowLayout, SESSION_KEY } from './desktop-session'

let storage: Map<string, string>
beforeEach(() => {
  storage = new Map()
  vi.stubGlobal('localStorage', { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) })
})
afterEach(() => vi.unstubAllGlobals())

describe('desktop session persistence', () => {
  it('restores known apps once, including minimized state and active app', () => {
    storage.set(SESSION_KEY, JSON.stringify({ windows: [{ name: 'Resume', minimized: true }, { name: 'Contact me' }, { name: 'Resume' }, { name: 'Unknown app' }, null], focused: 'Contact me' }))
    expect(readDesktopSession()).toEqual({ windows: [{ name: 'Resume', minimized: true }, { name: 'Contact me', minimized: false }], focused: 'Contact me' })
  })
  it('recovers from damaged or blocked storage', () => {
    storage.set(SESSION_KEY, 'broken json')
    expect(readDesktopSession()).toEqual({ windows: [], focused: null })
    vi.stubGlobal('localStorage', { getItem: () => { throw Error('blocked') }, setItem: () => { throw Error('full') } })
    expect(readDesktopSession().windows).toEqual([])
    expect(() => saveDesktopSession({ windows: [], focused: null })).not.toThrow()
  })
  it('clamps saved geometry to a smaller screen while preserving maximize and snap preferences', () => {
    saveWindowLayout('Resume', { position: { x: 1800, y: -100 }, size: { width: 1600, height: 1200 }, maximized: true, snap: 'right' })
    expect(readWindowLayout('Resume', { width: 800, height: 600 })).toEqual({ position: { x: 20, y: 40 }, size: { width: 780, height: 540 }, maximized: true, snap: 'right' })
  })
  it('rejects malformed geometry and unknown snap modes', () => {
    storage.set(layoutKey('Resume'), JSON.stringify({ position: { x: 'bad', y: 0 }, size: { width: 800, height: 600 } }))
    expect(readWindowLayout('Resume', { width: 1440, height: 1000 })).toBeNull()
    saveWindowLayout('Resume', { position: { x: 80, y: 90 }, size: { width: 700, height: 400 }, maximized: false, snap: 'invented' })
    expect(readWindowLayout('Resume', { width: 1440, height: 1000 })?.snap).toBeNull()
  })
})
