# Assets

| Folder | What lives here |
|---|---|
| `app-icons/` | Desktop, dock and mobile app icons (About, Resume, Projects, Blog, Links, Contact, Achievements, Terminal) |
| `wallpapers/` | All wallpapers, by device and screen: `desktop/home` (the switcher), `desktop/lock`, `mobile/home`, `mobile/lock` (see its README) |
| `mascots/` | Small characters and logos, including the animated WebP ones (loading cat, greeting, menu bar logo, achievement cat) |
| `mobile-widgets/` | Pictures used by the mobile home screen widgets |
| `music/ui/` | Music player buttons, icons and its background |
| `music/tracks/` | Track covers and the matching `.mp4` audio files (listed in `src/types/types.ts`) |
| `projects/` | Project screenshots for the Projects window |

Use WebP for pictures. When you convert a photo, apply its EXIF rotation first (`ImageOps.exif_transpose` in Pillow), or it can come out sideways.
