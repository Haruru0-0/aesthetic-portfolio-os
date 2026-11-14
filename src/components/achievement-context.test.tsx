import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AchievementProvider, AchievementNotifications, useAchievements } from './achievement-context'
import { createRef } from 'react'
import { WallpaperContext } from './wallpaper-context'

vi.mock('@/components/GlassPanel', async () => {
  const { useWallpaper } = await import('./wallpaper-context')
  return { GlassPanel: ({ children }: { children: React.ReactNode }) => <div data-testid="notification-glass" data-backdrop={useWallpaper() ? 'connected' : 'missing'}>{children}</div> }
})
vi.mock('gsap', () => {
  const animation = { kill: vi.fn() }
  const timeline = { to: vi.fn().mockImplementation((_target, options) => { options.onComplete?.(); return timeline }), kill: vi.fn() }
  return { gsap: { set: vi.fn(), fromTo: vi.fn(() => animation), to: vi.fn((_target, options) => { options.onComplete?.(); return animation }), timeline: vi.fn(() => timeline), killTweensOf: vi.fn() } }
})

function UnlockBurst() {
  const { unlock } = useAchievements()
  return <button onClick={() => { unlock('first_window'); unlock('about_me'); unlock('resume'); unlock('first_window') }}>Unlock burst</button>
}

beforeEach(() => { vi.stubGlobal('localStorage', { getItem: () => null, setItem: vi.fn() }) })
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers() })

describe.each([390, 1200])('achievement queue at %ipx', (width) => {
  it('shows one notification, counts waiting items, and advances without duplicates', () => {
    vi.useFakeTimers()
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
    render(<AchievementProvider><UnlockBurst /><WallpaperContext.Provider value={createRef<HTMLImageElement>()}><AchievementNotifications /></WallpaperContext.Provider></AchievementProvider>)
    fireEvent.click(screen.getByText('Unlock burst'))
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByText('Hello There!')).toBeTruthy()
    if (width >= 650) expect(screen.getByTestId('notification-glass').getAttribute('data-backdrop')).toBe('connected')
    expect(screen.queryByText('Getting to Know You')).toBeNull()
    expect(screen.getByText('2 more waiting')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Next achievement' }))
    expect(screen.getByText('Getting to Know You')).toBeTruthy()
    expect(screen.getByText('1 more waiting')).toBeTruthy()
    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.getByText('On the Record')).toBeTruthy()
    expect(screen.queryByText(/more waiting/)).toBeNull()
    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.queryByRole('status')).toBeNull()
  })
})
