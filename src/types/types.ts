import BlueCover from "../assets/music/tracks/blue.webp";
import BlueSong from "../assets/music/tracks/blue.mp4";
import LoveforYouCover from "../assets/music/tracks/LoveforYou.webp";
import LoveforYouSong from "../assets/music/tracks/LoveforYou.mp4";
import LoveWaveToEarthCover from "../assets/music/tracks/Love-wavetoearth.webp";
import LoveWaveToEarthSong from "../assets/music/tracks/Love-wavetoearth.mp4";
import GlueSongCover from "../assets/music/tracks/GlueSong.webp";
import GlueSong from "../assets/music/tracks/GlueSong.mp4";

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  src: string;
}

export const playlist: Track[] = [
  {
    id: 1,
    title: "Blue",
    artist: "Yung kai",
    duration: "3:34",
    cover: BlueCover,
    src: BlueSong,
  },
  {
    id: 2,
    title: "Love For You",
    artist: "Loveli Lori",
    duration: "2:51",
    cover: LoveforYouCover,
    src: LoveforYouSong,
  },
  {
    id: 3,
    title: "Love",
    artist: "Wave To Earth",
    duration: "5:06",
    cover: LoveWaveToEarthCover,
    src: LoveWaveToEarthSong,
  },
  {
    id: 4,
    title: "Glue Song",
    artist: "Beabadoobee",
    duration: "2:16",
    cover: GlueSongCover,
    src: GlueSong,
  },
];