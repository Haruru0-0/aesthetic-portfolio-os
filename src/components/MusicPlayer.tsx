import { useContext, useEffect, useId, useRef, useState, type ComponentProps, type CSSProperties } from "react";
import { Volume2 } from "lucide-react";
import { Slider } from "./ui/slider";
import { AudioContext } from "./audio-context";
import { GlassPanel } from "./GlassPanel";
import { WallpaperContext } from "./wallpaper-context";
import { TurntableArtwork } from "./TurntableArtwork";
import { useAppSound } from "./sound-context";
import { useAchievements } from "./achievement-context";
import { playlist, type Track } from "@/types/types";
import wallpaper from "@/assets/music/ui/MusicWallPaper.webp";
import sliderIcon from "@/assets/music/ui/slider-cinnamoroll-transparent.webp";
import playIcon from "@/assets/music/ui/cinnamoroll-actions/play.webp";
import pauseIcon from "@/assets/music/ui/cinnamoroll-actions/pause.webp";
import previousIcon from "@/assets/music/ui/cinnamoroll-actions/previous.webp";
import nextIcon from "@/assets/music/ui/cinnamoroll-actions/next.webp";
import playlistIcon from "@/assets/music/ui/cinnamoroll-actions/playlist.webp";
import closeIcon from "@/assets/music/ui/cinnamoroll-actions/close.webp";
import "./music-player.css";

function MusicButton({ icon, label, className = "", ...props }: ComponentProps<"button"> & { icon: string; label: string }) {
  return <button type="button" className={`music-action ${className}`} aria-label={label} {...props}><img src={icon} alt="" draggable={false} /></button>;
}

export default function MusicPlayer({ isDesktop = false }: { isDesktop?: boolean }) {
  const { audioRef, currentTrack, isPlaying, progress, volume, isLoading, setCurrentTrack, setIsPlaying, setProgress, setVolume, setIsLoading } = useContext(AudioContext);
  const { playClickSound, playMenuSound, playPowerUpSound } = useAppSound();
  const { unlock } = useAchievements();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dockBottom, setDockBottom] = useState(140);
  const queueId = useId();
  const playerRef = useRef<HTMLDivElement>(null);
  const playlistToggleRef = useRef<HTMLButtonElement>(null);
  const panelWallpaperRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isDesktop || !isExpanded) return;
    const measure = () => {
      const tops = [...document.querySelectorAll<HTMLElement>("[data-taskbar]")].map(dock => dock.getBoundingClientRect())
        .filter(box => box.width > 0 && box.height > 0).map(box => box.top);
      setDockBottom(Math.max(24, window.innerHeight - Math.min(window.innerHeight, ...tops) + 16));
    };
    const observer = new ResizeObserver(measure);
    document.querySelectorAll("[data-taskbar]").forEach(dock => observer.observe(dock));
    window.addEventListener("resize", measure); measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [isDesktop, isExpanded]);

  useEffect(() => {
    if (!showPlaylist) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape" && playerRef.current?.contains(document.activeElement)) {
        event.stopPropagation(); setShowPlaylist(false); playlistToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [showPlaylist]);

  const changeTrack = (track: Track) => { setCurrentTrack(track); setProgress(0); playMenuSound(); };
  const skip = (offset: number) => {
    const index = playlist.findIndex(track => track.id === currentTrack.id);
    changeTrack(playlist[(index + offset + playlist.length) % playlist.length]);
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const error = () => { setIsLoading(false); setIsPlaying(false); };
    audio.addEventListener("error", error);
    return () => { audio.removeEventListener("error", error); };
  }, [audioRef, currentTrack.id, setCurrentTrack, setProgress, setIsLoading, setIsPlaying]);

  const playPause = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); playClickSound(); }
      else { await audioRef.current.play(); setIsPlaying(true); playPowerUpSound(); unlock("music_head"); }
    } catch (error) { console.error("Playback error:", error); setIsPlaying(false); }
  };
  const seek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = audio.duration * value[0] / 100; setProgress(value[0]);
  };
  const elapsed = (() => {
    const duration = audioRef.current?.duration;
    if (!duration || !Number.isFinite(duration)) return "0:00";
    const seconds = Math.floor(duration * progress / 100);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  })();
  const closeQueue = () => { setShowPlaylist(false); playClickSound(); playlistToggleRef.current?.focus(); };
  const queueButton = <MusicButton ref={playlistToggleRef} icon={playlistIcon} label="Toggle playlist" aria-expanded={showPlaylist} aria-controls={queueId}
    onClick={() => { setShowPlaylist(open => !open); playMenuSound(); }} />;
  const controls = <div className="music-transport">
    <MusicButton icon={previousIcon} label="Previous track" onClick={() => skip(-1)} disabled={isLoading} />
    <MusicButton icon={isPlaying ? pauseIcon : playIcon} label={isLoading ? "Loading music" : isPlaying ? "Pause" : "Play"}
      className="music-action--play" aria-busy={isLoading} onClick={playPause} disabled={isLoading} />
    <MusicButton icon={nextIcon} label="Next track" onClick={() => skip(1)} disabled={isLoading} />
  </div>;
  const scrubber = <div className="music-progress">
    <Slider aria-label="Song progress" value={[progress]} max={100} step={0.1} onValueChange={seek} disabled={isLoading}
      className="music-slider cursor-pointer" style={{ "--music-progress": Math.min(1, Math.max(0, progress / 100)) } as CSSProperties}
      trackClassName="!bg-[#ccf2fc]" rangeClassName="!bg-[#74defc]"
      thumbClassName="!h-9 !w-9" thumb={<img src={sliderIcon} alt="" className="w-full h-full object-contain" />} />
    <div className="music-times"><span>{elapsed}</span><span>{currentTrack.duration}</span></div>
  </div>;
  const queue = <div className="music-queue-content">
    <div className="music-queue-heading"><h3>Playlist</h3><MusicButton icon={closeIcon} label="Close playlist" onClick={closeQueue} /></div>
    <div className="music-track-list">{playlist.map(track => <button type="button" key={track.id} className="music-track" aria-pressed={currentTrack.id === track.id}
      onClick={() => { changeTrack(track); if (!isDesktop) closeQueue(); }}>
      <img src={track.cover || "/placeholder.svg"} alt="" />
      <span className="music-track-info"><strong>{track.title}</strong><span>{track.artist}</span></span>
      <span className="music-track-duration">{track.duration}</span>
    </button>)}</div>
  </div>;

  if (isDesktop && !isExpanded) return <div data-music-widget="" className="fixed bottom-6 right-6 z-50">
    {!isPlaying && <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none">
      <GlassPanel radius="1rem" width="max-content" contentClassName="px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-white">♪ click to play</GlassPanel>
    </div>}
    <button type="button" className="music-turntable-trigger relative cursor-pointer p-0" aria-label="Open music player" onClick={() => { setIsExpanded(true); playMenuSound(); }}>
      <TurntableArtwork cover={currentTrack.cover || "/placeholder.svg"} title={currentTrack.title} playing={isPlaying && !isLoading} />
    </button>
  </div>;

  if (isDesktop) return <div ref={playerRef} role="region" aria-label="Music player" data-music-widget="" data-playlist-open={showPlaylist} className="music-player music-player--desktop fixed right-6 z-[70]"
    style={{ bottom: dockBottom, maxHeight: `calc(100dvh - ${dockBottom + 64}px)` }}>
    <img ref={panelWallpaperRef} className="music-panel-wallpaper" src={wallpaper} alt="" aria-hidden="true" />
    <header className="music-heading"><h3>Now Playing</h3><div className="music-heading-actions">{queueButton}
      <MusicButton icon={closeIcon} label="Close player" onClick={() => { setIsExpanded(false); setShowPlaylist(false); playClickSound(); }} />
    </div></header>
    <div className="music-main" inert={showPlaylist}>
      <div className="music-song"><img className="music-cover" src={currentTrack.cover || "/placeholder.svg"} alt={`${currentTrack.title} album cover`} />
        <div className="music-song-info" aria-live="polite"><h4>{currentTrack.title}</h4><p>{currentTrack.artist}</p></div>
      </div>{controls}{scrubber}
      <div className="music-volume"><Volume2 aria-hidden="true" size={16} />
        <Slider aria-label="Volume" value={[volume]} max={100} step={1} onValueChange={value => setVolume(value[0])}
          className="music-slider cursor-pointer" trackClassName="!bg-[#ccf2fc]" rangeClassName="!bg-[#74defc]" thumbClassName="!h-5 !w-5 !bg-[#e9f9ff] shadow-sm" />
        <span>{volume}%</span>
      </div>
    </div>
    <aside id={queueId} className="music-drawer" data-open={showPlaylist} inert={!showPlaylist} aria-hidden={!showPlaylist} aria-label="Playlist">
      <WallpaperContext.Provider value={panelWallpaperRef}>
        <GlassPanel radius="1.125rem" className="music-playlist-surface" contentClassName="music-playlist-body">{queue}</GlassPanel>
      </WallpaperContext.Provider>
    </aside>
  </div>;

  return <div ref={playerRef} data-music-widget="" className="music-mobile-wrapper">
    <div id={queueId} className="music-mobile-queue" data-open={showPlaylist} inert={!showPlaylist} aria-hidden={!showPlaylist} role="region" aria-label="Playlist">
      <GlassPanel radius="1.25rem" className="music-playlist-surface" contentClassName="music-playlist-body">{queue}</GlassPanel>
    </div>
    <div role="region" aria-label="Music player" className="music-player music-player--mobile" style={{ backgroundImage: `linear-gradient(#e9f8ff26,#e9f8ff26),url(${wallpaper})` }}>
      <img className="music-cover" src={currentTrack.cover || "/placeholder.svg"} alt={`${currentTrack.title} album cover`} />
      <div className="music-mobile-details">
        <div className="music-mobile-heading"><div className="music-song-info" aria-live="polite"><h4>{currentTrack.title}</h4><p>{currentTrack.artist}</p></div>{queueButton}</div>
        {controls}{scrubber}
      </div>
    </div>
  </div>;
}
