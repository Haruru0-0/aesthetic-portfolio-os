import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SoundProvider, useAppSound } from "@/components/sound-context";
import { GlassPanel } from "@/components/GlassPanel";
import { WallpaperContext } from "@/components/wallpaper-context";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useWallpaperSelection } from "@/lib/use-wallpaper-selection";
import { LockScreenSwitcher } from "@/components/LockScreenSwitcher";
import { useMediaQuery } from "@/hooks/use-media-query";

export const Route = createFileRoute("/")({
  component: App,
});

function LoginScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const { playClickSound, playErrorSound, playSuccessSound } = useAppSound();

  const isDesktop = useMediaQuery("(min-width: 650px)");

  const desktopLock = useWallpaperSelection("desktop-lock");
  const mobileLock = useWallpaperSelection("mobile-lock");
  const desktopWallpaperRef = useRef<HTMLImageElement>(null);
  const mobileWallpaperRef = useRef<HTMLImageElement>(null);
  const timeRef = useRef<HTMLHeadingElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const loginCardRef = useRef<HTMLDivElement>(null);
  const xButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clockGroupRef = useRef<HTMLDivElement>(null);
  const [darkClockText, setDarkClockText] = useState(false);

  useEffect(() => {
    const image = isDesktop ? desktopWallpaperRef.current : mobileWallpaperRef.current;
    const group = clockGroupRef.current;
    if (!image || !group) return;
    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 32;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    let frame = 0;
    const sample = () => {
      if (!image.complete || !image.naturalWidth) return;
      const backdrop = image.getBoundingClientRect();
      const text = group.getBoundingClientRect();
      if (!backdrop.width || !backdrop.height || !text.width || !text.height) return;
      // Match object-cover and object-center, including the cropped edges.
      const scale = Math.max(backdrop.width / image.naturalWidth, backdrop.height / image.naturalHeight);
      const cropX = (image.naturalWidth * scale - backdrop.width) / 2;
      const cropY = (image.naturalHeight * scale - backdrop.height) / 2;
      try {
        context.drawImage(image,
          (text.left - backdrop.left + cropX) / scale,
          (text.top - backdrop.top + cropY) / scale,
          text.width / scale, text.height / scale,
          0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const linear = (value: number) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        };
        let luminance = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          luminance += 0.2126 * linear(pixels[i]) + 0.7152 * linear(pixels[i + 1]) + 0.0722 * linear(pixels[i + 2]);
        }
        // Choose the higher-contrast foreground using relative luminance.
        setDarkClockText(luminance / (pixels.length / 4) > 0.179);
      } catch {
        setDarkClockText(false);
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sample);
    };
    image.addEventListener("load", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(image);
    observer.observe(group);
    schedule();
    return () => {
      image.removeEventListener("load", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [isDesktop, desktopLock.current?.src, mobileLock.current?.src]);

  useEffect(() => {
    router.preloadRoute({ to: "/desktop" });
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleScreenClick = () => {
    if (!showLogin) {
      playClickSound();
      setShowLogin(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "haru") {
      playSuccessSound();
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (containerRef.current && !prefersReducedMotion) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => { void navigate({ to: "/desktop" }); },
        });
      } else {
        navigate({ to: "/desktop" });
      }
    } else {
      playErrorSound();
      setIsWrongPassword(true);
      setTimeout(() => {
        setIsWrongPassword(false);
      }, 500);
    }
  };

  const handleCancel = () => {
    playClickSound();
    setShowLogin(false);
    setPassword("");
    setIsWrongPassword(false);
  };

  // GSAP Animations
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Initial time display animation
    if (timeRef.current && dateRef.current && hintRef.current && !showLogin) {
      if (prefersReducedMotion) {
        gsap.fromTo(
          [timeRef.current, dateRef.current, hintRef.current],
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.1 }
        );
      } else {
        gsap.fromTo(
          [timeRef.current, dateRef.current, hintRef.current],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
          }
        );

      }
    }

    // Login overlay animation
    if (showLogin && overlayRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
      } else {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }

      // Hide time display
      if (timeRef.current && dateRef.current && hintRef.current) {
        if (prefersReducedMotion) {
          gsap.to([timeRef.current, dateRef.current, hintRef.current], {
            opacity: 0,
            duration: 0.3,
          });
        } else {
          gsap.to([timeRef.current, dateRef.current, hintRef.current], {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      }
    }

    // Login card animation
    if (showLogin && loginCardRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(loginCardRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.2 });
      } else {
        gsap.fromTo(
          loginCardRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: 0.2, ease: "back.out(1.7)" }
        );
      }
    }

    // X button animation
    if (showLogin && xButtonRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(xButtonRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.35 });
      } else {
        gsap.fromTo(
          xButtonRef.current,
          { opacity: 0, scale: 0, rotate: -90 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.45, delay: 0.35, ease: "back.out(2)" }
        );
      }
    }

  }, [showLogin]);

  // Isolated shake — own useEffect so it never re-triggers the entrance animations
  useEffect(() => {
    if (!isWrongPassword || !inputRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.killTweensOf(inputRef.current, "x");
    gsap.fromTo(
      inputRef.current,
      { x: 0 },
      { x: 8, duration: 0.08, ease: "power2.out", yoyo: true, repeat: 5 }
    );
  }, [isWrongPassword]);

  return (
    <WallpaperContext.Provider value={isDesktop ? desktopWallpaperRef : mobileWallpaperRef}>
      <div
        ref={containerRef}
        className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
        onClick={handleScreenClick}
      >
        <img
          key={desktopLock.current?.id}
          ref={desktopWallpaperRef}
          src={desktopLock.current?.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="wallpaper-in pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center transition-opacity duration-700"
          style={{ opacity: isDesktop ? 1 : 0 }}
        />
        <img
          key={mobileLock.current?.id}
          ref={mobileWallpaperRef}
          src={mobileLock.current?.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="wallpaper-in pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center transition-opacity duration-700"
          style={{ opacity: isDesktop ? 0 : 1 }}
        />
        <LockScreenSwitcher choice={isDesktop ? desktopLock : mobileLock} portrait={!isDesktop} hidden={showLogin} />
        {/* Time display */}
        <div ref={clockGroupRef} data-dark-text={darkClockText} className="lockscreen-clock relative flex flex-col items-center">
          <h1 ref={timeRef} className="text-6xl font-bold mb-2">
            {formatTime(currentTime)}
          </h1>
          <p ref={dateRef} className="text-lg mb-6">
            {formatDate(currentTime)}
          </p>
          <p ref={hintRef} className="text-sm">
            <span className="lockscreen-unlock-hint">Click anywhere to unlock</span>
          </p>
        </div>

        {/* Login overlay */}
        {showLogin && (
          <div
            ref={overlayRef}
            className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={loginCardRef} className="w-64" style={{ opacity: 0 }}>
              <GlassPanel radius="2rem" contentClassName="flex flex-col items-center p-6 transition-[padding] duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:p-[1.7rem]">
                <Avatar className="w-20 h-20 mb-4 border-4 border-white/40">
                  <AvatarImage
                    src="/placeholder.svg?height=80&width=80"
                    alt="User"
                  />
                  <AvatarFallback className="bg-white/20 text-white text-xl">
                    ME
                  </AvatarFallback>
                </Avatar>

                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col justify-center space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      className={cn(
                        "bg-white/20 border-white/30 focus:border-white/60 rounded-xl text-white placeholder:text-white/60"
                      )}
                      autoFocus
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="h-8 w-8 shrink-0 cursor-pointer bg-white/30 hover:bg-white/50 text-white rounded-xl border border-white/30"
                      onClick={playClickSound}
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">Unlock</span>
                    </Button>
                  </div>
                  <p className="text-xs text-white/70 text-center">
                    Hint: The password is &apos;haru&apos;
                  </p>
                </form>
              </GlassPanel>
            </div>

            <button
              ref={xButtonRef}
              className="mt-4 cursor-pointer p-0"
              style={{ opacity: 0 }}
              onClick={handleCancel}
            >
              <GlassPanel radius="1.5rem" width="max-content" contentClassName="flex items-center justify-center p-2 transition-[padding] duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:p-3">
                <X className="h-5 w-5 text-white" />
                <span className="sr-only">Cancel</span>
              </GlassPanel>
            </button>
          </div>
        )}
      </div>
    </WallpaperContext.Provider>
  );
}

function App() {
  return (
    <SoundProvider>
      <LoginScreen />
    </SoundProvider>
  );
}
