import React from "react";
import { WallpaperBackdrop } from "./WallpaperBackdrop";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { AppWindow } from "./Window";
import { DesktopIcon } from "./Icon";
import { MobileIcon } from "./MobileIcon";
import { WallpaperText } from "./WallpaperText";
import { Taskbar } from "./Taskbar";
import { AppSwitcher } from "./AppSwitcher";
import { readDesktopSession, saveDesktopSession } from "@/lib/desktop-session";
import MenuBar from "./MenuBar";
import { CommandMenu } from "./CommandMenu";
import { DesktopContextMenu } from "./DesktopContextMenu";
import { GlassPanel } from "./GlassPanel";
import { WallpaperContext, WallpaperChoiceContext } from "./wallpaper-context";
import MusicPlayerWidget from "./MusicPlayerWidget";
import { Toaster } from "@/components/ui/sonner";
import { useWallpaperSelection } from "@/lib/use-wallpaper-selection";
import Project from "../assets/app-icons/project.webp";
import LinkIcon from "../assets/app-icons/Links.webp";
import Phone from "../assets/app-icons/phone.webp";
import BlogIcon from "../assets/app-icons/Blog.webp";
import About from "../assets/app-icons/about.webp";
import ResumeIcon from "../assets/app-icons/resume.webp";
import JellyfishIcon from "../assets/app-icons/jellyfish.webp";
import TerminalIcon from "../assets/app-icons/terminal.webp";
import GreetingGif from "../assets/mascots/greeting.webp";
import WaterCd from "../assets/mobile-widgets/water-cd.webp";
import CutePuppy from "../assets/mobile-widgets/cute-puppy.webp";
import { useMediaQuery } from "@/hooks/use-media-query";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AudioProvider } from "./audio-context";
import { SoundProvider } from "./sound-context";
import { MobileControlTiles } from "./MobileControlTiles";
import { AchievementProvider, AchievementNotifications, useAchievements, type AchievementId } from "./achievement-context";

const AboutMe = React.lazy(() => import("./pages/about-me"));
const Resume = React.lazy(() => import("./pages/resume"));
const Projects = React.lazy(() => import("./pages/projects"));
const Blog = React.lazy(() => import("./pages/blog"));
const Links = React.lazy(() => import("./pages/links"));
const Contact = React.lazy(() => import("./pages/contact"));
const Achievements = React.lazy(() => import("./pages/achievements"));
const Terminal = React.lazy(() => import("./pages/terminal"));

export default function Desktop() {
  return (
    <AchievementProvider>
      <DesktopInner />
    </AchievementProvider>
  );
}

function DesktopInner() {
  type WindowData = {
    name: string;
    minimized: boolean;
    component: React.ReactNode;
  };

  const isDesktop = useMediaQuery("(min-width: 650px)");
  const [viewportW, setViewportW] = useState(() => window.innerWidth);
  const [viewportH, setViewportH] = useState(() => window.innerHeight);
  const [menuBarHeight, setMenuBarHeight] = useState(70);
  const [dockClearance, setDockClearance] = useState(100);
  useEffect(() => {
    if (!isDesktop) return;
    const menu = document.querySelector<HTMLElement>("[data-menu-bar]");
    if (!menu) return;
    const measure = () => {
      const content = menu.querySelector<HTMLElement>("[data-menu-bar-content]");
      const style = content ? getComputedStyle(content) : null;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      // Reserve its expanded padding so hovering cannot change the icon row count.
      const expandedPadding = Number(menu.dataset.menuBarHoverPadding) || 1.375;
      const actualHeight = menu.getBoundingClientRect().height;
      const height = style ? actualHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) + expandedPadding * rem : actualHeight;
      setMenuBarHeight(Math.round(height));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(menu);
    measure();
    return () => observer.disconnect();
  }, [isDesktop]);
  useEffect(() => {
    if (!isDesktop) return;
    const dock = document.querySelector<HTMLElement>("[data-taskbar]");
    if (!dock) return;
    const measure = () => {
      const inner = dock.querySelector<HTMLElement>(".dock");
      if (!inner) return;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const frame = dock.offsetHeight - inner.offsetHeight;
      const base = Number(dock.dataset.taskbarBaseSize) || 50;
      const padding = (Number(dock.dataset.taskbarIdlePadding) || 1.2) * rem;
      const bottom = parseFloat(getComputedStyle(dock).bottom) || 0;
      // offsetHeight ignores the entrance transform; normal icon size ignores magnification.
      setDockClearance(Math.ceil(frame + base + padding + bottom + 12));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(dock);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [isDesktop]);
  const [greetingAside, setGreetingAside] = useState(false);
  const [greetingWidth, setGreetingWidth] = useState(240);
  const [greeting, setGreeting] = useState("Good morning");
  const greetingShellRef = useRef<HTMLDivElement>(null);
  const desktopIconAreaRef = useRef<HTMLDivElement>(null);
  const desktopIconGridRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const greetingImageRef = useRef<HTMLImageElement>(null);
  const greetingTextRef = useRef<HTMLHeadingElement>(null);
  const desktopIconsRef = useRef<HTMLDivElement[]>([]);
  const mobileIconsRef = useRef<HTMLDivElement[]>([]);
  const floatingAnims = useRef<gsap.core.Tween[]>([]);

  const pageOverlayRef = useRef<HTMLDivElement>(null);
  const wallpaperRef = useRef<HTMLImageElement>(null);
  const mobileWallpaperRef = useRef<HTMLImageElement>(null);

  const desktopHome = useWallpaperSelection("desktop", isDesktop);
  const mobileHome = useWallpaperSelection("mobile", !isDesktop);
  const desktopLock = useWallpaperSelection("desktop-lock", false);
  const mobileLock = useWallpaperSelection("mobile-lock", false);
  const currentWallpaper = desktopHome.current;
  const currentMobileWallpaper = mobileHome.current;

  useEffect(() => {
    const el = pageOverlayRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, {
      opacity: 0,
      duration: prefersReducedMotion ? 0.2 : 0.55,
      ease: "power2.out",
      onComplete: () => { el.style.display = "none"; },
    });
  }, []);

  const { unlock, unlocked } = useAchievements();
  const openedAppsRef = useRef<Set<string>>(new Set());
  const initialUnlockedRef = useRef(unlocked);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [folderPage, setFolderPage] = useState(0);
  const [folderDragOffset, setFolderDragOffset] = useState(0);
  const touchStartX = useRef(0);

  // First-run cue: shown until the visitor opens any window (persisted via the first_window achievement).
  const [cueReady, setCueReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCueReady(true), 1800);
    return () => clearTimeout(t);
  }, []);
  const showCue = cueReady && !unlocked.has('first_window');

  const CORE_APPS = ['About me', 'Resume', 'Projects', 'Blog', 'Links', 'Contact me'];

  useEffect(() => {
    const achievementToApp: Record<string, string> = {
      about_me: 'About me',
      resume: 'Resume',
      projects: 'Projects',
      blog: 'Blog',
      links: 'Links',
      contact: 'Contact me',
    };
    initialUnlockedRef.current.forEach(id => {
      const appName = achievementToApp[id];
      if (appName) openedAppsRef.current.add(appName);
    });
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) unlock('night_owl');
    if (hour >= 5 && hour < 7) unlock('early_bird');
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const onResize = () => { setViewportW(window.innerWidth); setViewportH(window.innerHeight); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [desktopApps, setDesktopApps] = useState([
    { id: "about", label: "About me", icon: About },
    { id: "resume", label: "Resume", icon: ResumeIcon },
    { id: "projects", label: "Projects", icon: Project },
    { id: "blog", label: "Blog", icon: BlogIcon },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "contact", label: "Contact me", icon: Phone },
    { id: "achievements", label: "Achievements", icon: JellyfishIcon },
    { id: "terminal", label: "Terminal", icon: TerminalIcon },
  ]);

  const initialAppsRef = useRef(desktopApps);
  // Normal tiles need 96px; leave room for one selected label to expand without changing columns.
  const rowsThatFit = Math.max(1, Math.floor((viewportH - menuBarHeight - 12 - dockClearance - 24 + 16) / 112));
  const desktopIconRows = Math.min(Math.ceil(desktopApps.length / 2), rowsThatFit);
  useEffect(() => {
    if (!isDesktop) return;
    const shell = greetingShellRef.current;
    const grid = desktopIconGridRef.current;
    const area = desktopIconAreaRef.current;
    if (!shell || !grid || !area) return;
    const measure = () => {
      const width = shell.offsetWidth;
      const left = window.innerWidth / 2 - width / 2;
      const bounds = area.getBoundingClientRect();
      // Compare with the unscrolled icon footprint, so moving aside cannot cause a feedback loop.
      const iconsRight = bounds.left + grid.offsetWidth;
      const nearCenter = iconsRight > left - 24 && bounds.left < left + width + 24;
      const overlapsHeight = bounds.top < 36 + shell.offsetHeight && bounds.top + grid.offsetHeight > 36;
      setGreetingWidth(width);
      setGreetingAside(nearCenter && overlapsHeight);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(shell); observer.observe(grid);
    measure();
    return () => observer.disconnect();
  }, [isDesktop, viewportW, viewportH, desktopIconRows, menuBarHeight, showCue]);

  // 50px icon + 8px gap = 58px/slot; ~20px dock padding + 8px safe margin = 28px overhead
  const maxFit   = Math.floor((viewportW - 28) / 58);
  const splitAt  = maxFit >= desktopApps.length ? desktopApps.length : Math.max(1, maxFit - 1);
  const taskbarVisible  = desktopApps.slice(0, splitAt);
  const taskbarOverflow = desktopApps.slice(splitAt);

  const [initialSession] = useState(readDesktopSession);
  const [openWindows, setOpenWindows] = useState<WindowData[]>(() => initialSession.windows.map(win => ({ ...win, component: getComponentForWindow(win.name) })));
  const [focusedWindow, setFocusedWindow] = useState<string | null>(initialSession.focused);
  const [focusRequests, setFocusRequests] = useState<Record<string, number>>(() => initialSession.focused ? { [initialSession.focused]: 1 } : {});
  const [switcherOpen, setSwitcherOpen] = useState(false);
  useEffect(() => { saveDesktopSession({ windows: openWindows.map(({ name, minimized }) => ({ name, minimized })), focused: focusedWindow }) }, [openWindows, focusedWindow]);
  const requestAppFocus = (name: string) => {
    setFocusedWindow(name);
    setFocusRequests(previous => ({ ...previous, [name]: (previous[name] ?? 0) + 1 }));
  };
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveAppId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveAppId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDesktopApps((apps) => {
        const oldIndex = apps.findIndex((a) => a.id === active.id);
        const newIndex = apps.findIndex((a) => a.id === over.id);
        return arrayMove(apps, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    const nonMinimized = openWindows.filter(w => !w.minimized).length;
    if (nonMinimized >= 3) unlock('multitasker');
  }, [openWindows, unlock]);

  useEffect(() => {
    if (!isDesktop) {
      const hasOpenWindow = openWindows.some((w) => !w.minimized);
      if (hasOpenWindow) {
        floatingAnims.current.forEach((anim) => anim.pause());
      } else {
        floatingAnims.current.forEach((anim) => anim.resume());
      }
    }
  }, [openWindows, isDesktop]);

  function getComponentForWindow(name: string) {
    switch (name) {
      case "About me":
        return <AboutMe />;
      case "Resume":
        return <Resume />;
      case "Projects":
        return <Projects />;
      case "Blog":
        return <Blog />;
      case "Links":
        return <Links />;
      case "Contact me":
        return <Contact />;
      case "Achievements":
        return <Achievements />;
      case "Terminal":
        return <Terminal />;
      default:
        return <div>Content for {name}</div>;
    }
  };

  const appAchievements: Record<string, AchievementId> = {
    'About me': 'about_me',
    'Resume': 'resume',
    'Projects': 'projects',
    'Blog': 'blog',
    'Links': 'links',
    'Contact me': 'contact',
  };

  const openWindow = (name: string) => {
    requestAppFocus(name);
    setOpenWindows((prev) => {
      if (prev.find((w) => w.name === name)) return prev.map(w => w.name === name ? { ...w, minimized: false } : w);
      return [
        ...prev,
        { name, minimized: false, component: getComponentForWindow(name) },
      ];
    });

    if (!openedAppsRef.current.has(name)) {
      openedAppsRef.current.add(name);

      if (openedAppsRef.current.size === 1) unlock('first_window');

      const achievementId = appAchievements[name];
      if (achievementId) unlock(achievementId);

      if (CORE_APPS.every(app => openedAppsRef.current.has(app))) {
        unlock('all_apps');
      }
    }
  };

  const closeWindow = (name: string) => {
    if (focusedWindow === name) setFocusedWindow([...openWindows].reverse().find(win => win.name !== name && !win.minimized)?.name ?? null);
    setOpenWindows((prev) => prev.filter((w) => w.name !== name));
  };

  const minimizeWindow = (name: string) => {
    if (focusedWindow === name) setFocusedWindow([...openWindows].reverse().find(win => win.name !== name && !win.minimized)?.name ?? null);
    setOpenWindows((prev) =>
      prev.map((w) => (w.name === name ? { ...w, minimized: true } : w))
    );
    unlock('minimize');
  };

  const restoreWindow = (name: string) => {
    requestAppFocus(name);
    setOpenWindows((prev) =>
      prev.map((w) => (w.name === name ? { ...w, minimized: false } : w))
    );
  };

  const handleAppClick = (label: string) => {
    const win = openWindows.find((w) => w.name === label);
    if (win?.minimized) {
      restoreWindow(label);
    } else {
      openWindow(label);
    }
  };

  // GSAP Animations
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        if (greetingRef.current) {
          gsap.fromTo(
            greetingRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: 0.3 }
          );
        }

        desktopIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0 },
              { opacity: 1, duration: 0.3, delay: index * 0.05 }
            );
          }
        });

        mobileIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0 },
              { opacity: 1, duration: 0.3, delay: index * 0.05 }
            );
          }
        });
        return;
      }

      if (isDesktop && greetingRef.current) {
        const tl = gsap.timeline();

        tl.fromTo(
          greetingRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
        );

        if (greetingImageRef.current) {
          tl.fromTo(
            greetingImageRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
            "-=0.5"
          );

          floatingAnims.current.push(
            gsap.to(greetingImageRef.current, {
              y: -10,
              duration: 3,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
            })
          );
        }

        if (greetingTextRef.current) {
          floatingAnims.current.push(
            gsap.to(greetingTextRef.current, {
              opacity: 0.7,
              duration: 3,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
            })
          );
        }
      }

      if (isDesktop) {
        desktopIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0, x: -20 },
              {
                opacity: 1,
                x: 0,
                duration: 0.5,
                delay: index * 0.1,
                ease: "back.out(1.7)",
              }
            );
          }
        });
      } else {
        mobileIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0, scale: 0.8 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                delay: index * 0.1,
                ease: "back.out(1.7)",
              }
            );
          }
        });
      }

      const floatingElements =
        document.querySelectorAll<HTMLElement>(".animate-float");
      floatingElements.forEach((element) => {
        floatingAnims.current.push(
          gsap.to(element, {
            y: -10,
            duration: 6,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
          })
        );
      });
    },
    { dependencies: [isDesktop, greeting], revertOnUpdate: true }
  );

  return (
        <WallpaperChoiceContext.Provider value={isDesktop ? { ...desktopHome, lock: desktopLock } : { ...mobileHome, lock: mobileLock }}>
    <WallpaperContext.Provider value={isDesktop ? wallpaperRef : mobileWallpaperRef}>
    <AchievementNotifications />
    <SoundProvider>
      <AudioProvider>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <DesktopContextMenu
            enabled={isDesktop}
            apps={desktopApps}
            onOpenApp={handleAppClick}
            onOpenPalette={() => setPaletteOpen(true)}
            onSortApps={() => setDesktopApps((apps) => [...apps].sort((a, b) => a.label.localeCompare(b.label)))}
            onResetApps={() => setDesktopApps(initialAppsRef.current)}
          >
          <div className="fixed inset-0 overflow-hidden" onClick={() => setSelectedAppId(null)}>
            <WallpaperBackdrop src={currentWallpaper?.src} imageRef={wallpaperRef} active={isDesktop} />
            <WallpaperBackdrop src={currentMobileWallpaper?.src} imageRef={mobileWallpaperRef} active={!isDesktop} />
            {/* Page transition overlay — fades out on mount */}
            <div
              ref={pageOverlayRef}
              className="fixed inset-0 bg-black z-[99999] pointer-events-none"
            />

            {isDesktop && <MenuBar onOpenPalette={() => setPaletteOpen(true)} onOpenSwitcher={() => setSwitcherOpen(true)} />}

            {isDesktop && (
              <div ref={greetingShellRef} data-greeting-position={greetingAside ? "side" : "center"} className={`absolute w-max max-w-[calc(100vw-2rem)] text-center pointer-events-none ${greetingAside ? "right-4" : "top-9 left-1/2 -translate-x-1/2"}`} style={greetingAside ? { top: menuBarHeight + 12 } : undefined}>
                <div ref={greetingRef} className="flex flex-col items-center">
                  <img
                    ref={greetingImageRef}
                    src={GreetingGif}
                    alt="Cute greeting"
                    className="size-24 mb-2 animate-float"
                    style={{
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                    }}
                  />
                  <h1
                    ref={greetingTextRef}
                    className="text-2xl font-bold text-white drop-shadow-md"
                  >
                    <WallpaperText>{greeting}!</WallpaperText>
                  </h1>
                  <p
                    aria-live="polite"
                    className="mt-1 whitespace-nowrap text-sm text-white/90 drop-shadow-md transition-opacity duration-700"
                    style={{ opacity: showCue ? 1 : 0 }}
                  >
                    <WallpaperText>{showCue ? "Double-click an icon to open it" : ""}</WallpaperText>
                  </p>
                </div>
              </div>
            )}

            {isDesktop ? (
              <div className="absolute inset-0 flex flex-col gap-2 p-4" style={{ paddingTop: menuBarHeight + 12, paddingBottom: dockClearance }}>
                {/* flex-1 + min-h-0 lets this shrink and defines the icon column height */}
                <div ref={desktopIconAreaRef} className="flex-1 min-h-0 overflow-auto" role="group" aria-label="Desktop apps" style={greetingAside ? { marginRight: greetingWidth + 16 } : undefined}>
                  <SortableContext
                    items={desktopApps.map((a) => a.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div ref={desktopIconGridRef} className="grid w-max grid-flow-col auto-cols-[7rem] content-start gap-4 pointer-events-none" style={{ gridTemplateRows: `repeat(${desktopIconRows}, minmax(6rem, max-content))` }}>
                      {desktopApps.map((app, index) => (
                        <div
                          key={app.id}
                          className="min-h-24"
                          ref={(el) => {
                            if (el) desktopIconsRef.current[index] = el;
                          }}
                        >
                          <DesktopIcon
                            id={app.id}
                            label={app.label}
                            icon={app.icon}
                            onDoubleClick={() => openWindow(app.label)}
                            onSelect={() => setSelectedAppId(app.id)}
                            isSelected={selectedAppId === app.id}
                            isBeingDragged={activeAppId === app.id}
                          />
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </div>
                <MusicPlayerWidget isDesktop={true} />
                <Taskbar
                  apps={taskbarVisible}
                  overflowApps={taskbarOverflow}
                  openWindows={openWindows}
                  onAppClick={handleAppClick}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col overflow-hidden p-3 pb-[82px] gap-3">
                <div className="flex flex-col gap-3">
                  {/* Top row: 2-page folder + water CD */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Folder */}
                    <GlassPanel
                      radius="1rem"
                      contentClassName="flex h-[195px] flex-col overflow-hidden p-0 transition-[height] duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:h-[204px]"
                    >
                      <div className="flex flex-1 flex-col overflow-hidden">
                        {/* Sliding pages */}
                        <div
                          className="flex flex-1 overflow-hidden"
                          onTouchStart={e => {
                            touchStartX.current = e.touches[0].clientX;
                          }}
                          onTouchMove={e => {
                            const diff = e.touches[0].clientX - touchStartX.current;
                            // Add rubber-band resistance at the edges
                            if ((folderPage === 0 && diff > 0) || (folderPage === 1 && diff < 0)) {
                              setFolderDragOffset(diff * 0.25);
                            } else {
                              setFolderDragOffset(diff);
                            }
                          }}
                          onTouchEnd={e => {
                            const diff = touchStartX.current - e.changedTouches[0].clientX;
                            if (diff > 40) setFolderPage(1);
                            else if (diff < -40) setFolderPage(0);
                            setFolderDragOffset(0);
                          }}
                        >
                          <div
                            className="flex w-full"
                            style={{
                              transform: `translateX(calc(-${folderPage * 100}% + ${folderDragOffset}px))`,
                              transition: folderDragOffset !== 0 ? 'none' : 'transform 300ms ease-out',
                            }}
                          >
                            {/* Page 1: apps 0–3 */}
                            <div className="grid grid-cols-2 gap-1 auto-rows-min justify-items-center p-2 flex-shrink-0 w-full content-start">
                              {desktopApps.slice(0, 4).map((app, index) => (
                                <div
                                  key={app.id}
                                  ref={(el) => { if (el) mobileIconsRef.current[index] = el; }}
                                >
                                  <MobileIcon
                                    id={app.id}
                                    label={app.label}
                                    icon={app.icon}
                                    onClick={() => openWindow(app.label)}
                                  />
                                </div>
                              ))}
                            </div>
                            {/* Page 2: apps 4–7 (Links, Contact, Achievements, Terminal) */}
                            <div className="grid grid-cols-2 gap-1 auto-rows-min justify-items-center p-2 flex-shrink-0 w-full content-start">
                              {desktopApps.slice(4).map((app, index) => (
                                <div
                                  key={app.id}
                                  ref={(el) => { if (el) mobileIconsRef.current[index + 4] = el; }}
                                >
                                  <MobileIcon
                                    id={app.id}
                                    label={app.label}
                                    icon={app.icon}
                                    onClick={() => openWindow(app.label)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Page dots */}
                        <div className="flex justify-center gap-1.5 pb-2">
                          {[0, 1].map(i => (
                            <button
                              key={i}
                              onClick={() => setFolderPage(i)}
                              aria-label={`Page ${i + 1}`}
                              aria-current={folderPage === i}
                              className={`cursor-pointer w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                folderPage === i ? 'bg-white' : 'bg-white/35'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </GlassPanel>

                    {/* Water CD */}
                    <div className="flex justify-center">
                      <div className="relative overflow-hidden rounded-2xl h-[180px]">
                        <img
                          src={WaterCd}
                          className="h-full animate-float-smooth"
                          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
                        />
                        <div className="widget-glass-overlay rounded-2xl" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom row: puppy + control tiles */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-center">
                      <div className="relative overflow-hidden rounded-2xl h-[160px]">
                        <img
                          src={CutePuppy}
                          className="h-full animate-float-smooth"
                          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
                        />
                        <div className="widget-glass-overlay rounded-2xl" />
                      </div>
                    </div>
                    <MobileControlTiles onOpenSwitcher={() => setSwitcherOpen(true)} />
                  </div>

                  <MusicPlayerWidget isDesktop={false} />
                </div>
                <Taskbar
                  apps={taskbarVisible}
                  overflowApps={taskbarOverflow}
                  openWindows={openWindows}
                  onAppClick={handleAppClick}
                  className="mt-auto"
                />
              </div>
            )}

            {openWindows.map((win) => (
              <AppWindow
                key={win.name}
                title={win.name}
                onClose={() => closeWindow(win.name)}
                onMinimize={() => minimizeWindow(win.name)}
                isMobile={!isDesktop}
                isMinimized={win.minimized}
                focusRequest={focusRequests[win.name] ?? 0}
                onActivate={() => setFocusedWindow(win.name)}
              >
                {win.component}
              </AppWindow>
            ))}

            <AppSwitcher open={switcherOpen} onOpenChange={setSwitcherOpen} activeName={focusedWindow} onSelect={handleAppClick} onSearch={() => setPaletteOpen(true)} apps={openWindows.map(win => ({ name: win.name, minimized: win.minimized, icon: desktopApps.find(app => app.label === win.name)?.icon ?? About }))} />
            <CommandMenu
              open={paletteOpen}
              onOpenChange={setPaletteOpen}
              apps={desktopApps}
              onOpenApp={handleAppClick}
            />

            <Toaster position={isDesktop ? "top-right" : "top-center"} offset={isDesktop ? { top: 60, right: 16 } : undefined} />
          </div>
          </DesktopContextMenu>

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeAppId ? (() => {
              const app = desktopApps.find((a) => a.id === activeAppId);
              if (!app) return null;
              return (
                <div className="liquidGlass-icon desktop-icon w-20 sm:w-24 md:w-28 p-2 mb-2 select-none cursor-grabbing scale-110 opacity-90 drop-shadow-2xl">
                  <div className="liquidGlass-effect" />
                  <div className="liquidGlass-tint" />
                  <div className="liquidGlass-shine" />
                  <div className="liquidGlass-content">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img
                        src={app.icon}
                        alt={app.label}
                        className="max-w-full max-h-full object-contain drop-shadow-md"
                      />
                    </div>
                    <span className="desktop-icon-text">{app.label}</span>
                  </div>
                </div>
              );
            })() : null}
          </DragOverlay>
        </DndContext>
      </AudioProvider>
    </SoundProvider>
    </WallpaperContext.Provider>
    </WallpaperChoiceContext.Provider>
  );
}
