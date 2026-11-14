import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import HappyCat from '@/assets/mascots/happy-cat.webp'
import { GlassPanel } from '@/components/GlassPanel'

export type AchievementId =
  | 'first_window' | 'about_me' | 'resume' | 'projects' | 'blog' | 'links' | 'contact'
  | 'all_apps' | 'multitasker' | 'music_head' | 'night_owl' | 'early_bird' | 'minimize'
  | 'terminal_open' | 'hire_me'

export type Achievement = {
  id: AchievementId
  name: string
  description: string
  icon: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_window', name: 'Hello There!', description: 'You opened your very first app ✨', icon: '👋' },
  { id: 'about_me', name: 'Getting to Know You', description: 'You peeked at the About Me page 🌸', icon: '🙋' },
  { id: 'resume', name: 'On the Record', description: 'You checked out the resume 📋', icon: '📄' },
  { id: 'projects', name: 'Show Me More!', description: 'You browsed through the projects 🚀', icon: '🚀' },
  { id: 'blog', name: 'Bookworm', description: 'You opened the blog — a fellow reader! 📚', icon: '📖' },
  { id: 'links', name: 'Well Connected', description: 'You explored the links page 🔗', icon: '🔗' },
  { id: 'contact', name: 'Say Hi!', description: "You opened the contact page 💌", icon: '📬' },
  { id: 'all_apps', name: 'Full Stack Explorer', description: "You opened every single app! You're amazing! 🏆", icon: '🏆' },
  { id: 'multitasker', name: 'Multitasker', description: 'You had 3 windows open at once — busy bee! 🐝', icon: '🪟' },
  { id: 'music_head', name: 'Music Head', description: 'You hit play! Great taste 🎶', icon: '🎵' },
  { id: 'night_owl', name: 'Night Owl', description: 'Browsing after midnight? Same 🦉', icon: '🦉' },
  { id: 'early_bird', name: 'Early Bird', description: "Up before 7am? You're dedicated! ☀️", icon: '🐦' },
  { id: 'minimize', name: 'Neat Freak', description: 'You minimized a window — so tidy! 🧹', icon: '➖' },
  { id: 'terminal_open', name: 'Hacker Mode', description: 'You opened the terminal 💻', icon: '🖥️' },
  { id: 'hire_me', name: 'Bold Move!', description: 'You ran sudo hire-ahmad 👀 nice.', icon: '💼' },
]

// ── Desktop toast (liquid glass, slides from right) ─────────────────────────

type NotificationProps = { achievement: Achievement; pending: number; onDone: () => void }

function QueueControls({ pending, onDone }: Pick<NotificationProps, "pending" | "onDone">) {
  return pending > 0 ? (
    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-200">
      <span>{pending} more waiting</span>
      <button type="button" aria-label="Next achievement" onClick={onDone} className="cursor-pointer rounded-full bg-white/10 px-3 py-1 font-semibold text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200">Next</button>
    </div>
  ) : null
}

function DesktopToastContent({ achievement, pending, onDone }: NotificationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.fromTo(el,
      { x: 140, opacity: 0, scale: 0.88 },
      { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )

    const timer = setTimeout(() => {
      if (!ref.current) { onDone(); return }
      gsap.to(ref.current, {
        x: 140, opacity: 0, scale: 0.88,
        duration: 0.4, ease: 'back.in(1.7)',
        onComplete: onDone,
      })
    }, 5000)

    return () => { clearTimeout(timer); gsap.killTweensOf(el) }
  }, [onDone])

  return (
    // No will-change here: it makes this wrapper a "backdrop root", so the glass inside
    // could not see the wallpaper or windows behind the toast.
    <div ref={ref} role="status" aria-live="polite" aria-atomic="true" className="group fixed right-4 top-[max(60px,env(safe-area-inset-top))] z-[99999] w-80 max-w-[calc(100vw-2rem)]">
      <GlassPanel radius="1rem" contentClassName="flex items-center gap-3 p-3 transition-[padding] duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] group-hover:p-4 motion-reduce:transition-none [text-shadow:0_1px_3px_rgba(0,15,50,0.9)]">
        <div className="contents">
          <img src={HappyCat} alt="" className="w-12 h-12 rounded-xl flex-shrink-0 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-medium leading-tight text-sky-200">Achievement unlocked</p>
            <p className="mb-1 font-bold text-base text-white leading-tight">{achievement.name}</p>
            <p className="text-xs text-slate-100 leading-snug line-clamp-2">{achievement.description}</p>
            <QueueControls pending={pending} onDone={onDone} />
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}

// ── Mobile toast (Dynamic Island pill, fixed-centered at top) ────────────────

function MobileDynamicToast({ achievement, pending, onDone }: NotificationProps) {
  const pillRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pill = pillRef.current
    const content = contentRef.current
    if (!pill || !content) return

    const expandedWidth = Math.min(300, window.innerWidth - 32)

    gsap.set(pill, { width: 110, height: 34, borderRadius: 100 })
    gsap.set(content, { opacity: 0 })

    const tl = gsap.timeline()
    tl.to(pill, { width: expandedWidth, height: 144, borderRadius: 22, duration: 0.55, ease: 'back.out(1.7)' })
      .to(content, { opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.1')

    const timer = setTimeout(() => {
      gsap.timeline()
        .to(content, { opacity: 0, duration: 0.2 })
        .to(pill, { width: 110, height: 34, borderRadius: 100, duration: 0.4, ease: 'back.in(1.7)' })
        .to(pill, { y: -60, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: onDone })
    }, 5000)

    return () => { clearTimeout(timer); tl.kill(); gsap.killTweensOf([pill, content]) }
  }, [onDone])

  const expandedWidth = Math.min(300, window.innerWidth - 32)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: 'max(12px, env(safe-area-inset-top))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      <div
        ref={pillRef}
        className="liquidGlass-wrapper"
        style={{ willChange: 'width, height, border-radius, transform' }}
      >
        <div className="liquidGlass-effect" style={{ borderRadius: 'inherit' }} />
        <div className="liquidGlass-tint" style={{ borderRadius: 'inherit' }} />
        <div className="liquidGlass-shine" style={{ borderRadius: 'inherit' }} />
        <div ref={contentRef} className="liquidGlass-content flex items-center gap-3 rounded-[inherit] bg-[rgba(30,110,200,0.24)] px-3 py-3 [text-shadow:0_1px_3px_rgba(0,15,50,0.9)]" style={{ width: expandedWidth, minHeight: 144 }}>
          <img src={HappyCat} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-medium leading-tight text-sky-200">Achievement unlocked</p>
            <p className="mb-1 font-bold text-base text-white leading-tight">{achievement.name}</p>
            <p className="text-xs text-slate-100 leading-snug line-clamp-2">{achievement.description}</p>
            <QueueControls pending={pending} onDone={onDone} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Context ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'portfolio-achievements'

type AchievementContextType = {
  achievements: Achievement[]
  unlocked: Set<AchievementId>
  unlock: (id: AchievementId) => void
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined)
const AchievementNotificationContext = createContext<React.ReactNode>(null)

// Render inside WallpaperContext so GlassPanel receives the live backdrop image.
export function AchievementNotifications() {
  return useContext(AchievementNotificationContext)
}

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? new Set<AchievementId>(JSON.parse(saved)) : new Set<AchievementId>()
    } catch {
      return new Set<AchievementId>()
    }
  })

  const [notificationQueue, setNotificationQueue] = useState<Array<{ achievement: Achievement; mobile: boolean }>>([])
  const finishNotification = useCallback(() => setNotificationQueue(queue => queue.slice(1)), [])
  const prevUnlockedRef = useRef<Set<AchievementId>>(new Set(unlocked))

  const unlock = useCallback((id: AchievementId) => {
    setUnlocked(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  useEffect(() => {
    const newlyUnlocked = [...unlocked].filter(id => !prevUnlockedRef.current.has(id))
    const added = newlyUnlocked.flatMap(id => {
      const achievement = ACHIEVEMENTS.find(item => item.id === id)
      return achievement ? [{ achievement, mobile: window.innerWidth < 650 }] : []
    })
    if (added.length) setNotificationQueue(queue => [...queue, ...added])
    prevUnlockedRef.current = new Set(unlocked)
  }, [unlocked])

  const current = notificationQueue[0]
  const pending = notificationQueue.length - 1

  return (
    <AchievementContext.Provider value={{ achievements: ACHIEVEMENTS, unlocked, unlock }}>
      <AchievementNotificationContext.Provider value={current && (current.mobile ? (
        <MobileDynamicToast key={current.achievement.id} achievement={current.achievement} pending={pending} onDone={finishNotification} />
      ) : (
        <DesktopToastContent key={current.achievement.id} achievement={current.achievement} pending={pending} onDone={finishNotification} />
      ))}>
        {children}
      </AchievementNotificationContext.Provider>
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementContext)
  if (!ctx) throw new Error('useAchievements must be used within AchievementProvider')
  return ctx
}
