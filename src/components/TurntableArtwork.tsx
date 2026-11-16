import turntable from "@/assets/music/ui/cinnamoroll-turntable-blue.webp";
import "./turntable-artwork.css";

interface TurntableArtworkProps {
  cover: string;
  title: string;
  playing: boolean;
}

export function TurntableArtwork({ cover, title, playing }: TurntableArtworkProps) {
  return (
    <span className="turntable-artwork" data-playing={playing}>
      <img className="turntable-artwork__body" src={turntable} alt="" draggable={false} />
      <span className="turntable-artwork__label">
        <img src={cover} alt={`${title} album cover`} draggable={false} />
        <span className="turntable-artwork__spindle" />
      </span>
      <svg className="turntable-artwork__arm" viewBox="0 0 1000 1000" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="turntable-arm-metal" x1="800" y1="200" x2="830" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#70a4c4" />
            <stop offset=".4" stopColor="#f6fcff" />
            <stop offset=".65" stopColor="#deeff9" />
            <stop offset="1" stopColor="#83b2ce" />
          </linearGradient>
          <linearGradient id="turntable-arm-head" x1="-25" y1="0" x2="25" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9dc9df" />
            <stop offset=".4" stopColor="#f8fdff" />
            <stop offset="1" stopColor="#b8dcee" />
          </linearGradient>
          <radialGradient id="turntable-arm-pivot" cx=".35" cy=".3" r=".75">
            <stop stopColor="#f8fdff" />
            <stop offset=".65" stopColor="#c3deef" />
            <stop offset="1" stopColor="#82abc5" />
          </radialGradient>
        </defs>
        <g className="turntable-artwork__moving-arm">
          <path d="M820 200V658Q820 707 795 751L752 826" stroke="#5686a5" strokeWidth="24" strokeLinecap="round" />
          <path d="M820 200V658Q820 707 795 751L752 826" stroke="url(#turntable-arm-metal)" strokeWidth="18" strokeLinecap="round" />
          <path d="M817 248V654Q817 703 792 747L756 810" stroke="#f5fcff" strokeOpacity=".8" strokeWidth="4" strokeLinecap="round" />
          <g transform="translate(752 826) rotate(30)">
            <rect x="-25" y="-13" width="50" height="75" rx="10" fill="url(#turntable-arm-head)" stroke="#6c9bb8" strokeWidth="3" />
            <rect x="-10" y="20" width="20" height="23" rx="5" fill="#76a9c8" />
            <path d="M-16 3H16" stroke="#fff" strokeOpacity=".9" strokeWidth="3" strokeLinecap="round" />
            <path d="M0 62V69" stroke="#47718d" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
        <circle cx="820" cy="200" r="40" fill="#c3deed" stroke="#7ea9c4" strokeWidth="4" />
        <circle cx="820" cy="200" r="30" fill="url(#turntable-arm-pivot)" stroke="#f0faff" strokeWidth="3" />
        <circle cx="820" cy="200" r="7" fill="#a3c7dd" />
      </svg>
    </span>
  );
}
