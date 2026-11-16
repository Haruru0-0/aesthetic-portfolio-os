# Aesthetic Portfolio OS

A personal portfolio that looks and behaves like a desktop operating system: a lock screen, windows you can
drag and resize, a dock, a command palette, wallpapers you can switch, and liquid-glass surfaces throughout.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)](https://tailwindcss.com/)

## Features

- **Desktop interface:** draggable, resizable, snappable windows; a dock with macOS-style magnification; a menu bar;
  desktop icons you can reorder; a music player widget; 8-bit sound effects with a volume panel.
- **Lock screen:** clock, password login, and a settings button (bottom right) to change the lock wallpaper.
- **Windows:** About Me, Resume (with a career timeline), Projects, Blog (posts from Hashnode, with search), Links,
  Contact (EmailJS form), Terminal (a shell and an animated showreel) and Achievements (unlockable, with an XP bar).
- **Command palette:** `Ctrl/Cmd + K` opens apps, copies the email, downloads the resume and switches wallpapers.
- **Right-click menu:** on the desktop, to open apps, sort icons, toggle sound, change theme and switch wallpapers.
- **Wallpapers:** separate sets for desktop and mobile, home and lock screens. Drop an image into the right folder and
  it appears in the switchers (see [Customizing](#customizing)).
- **Mobile layout:** a home screen with a folder of apps, widgets, and a 2x2 control grid (Sound, Theme, Wallpaper, Apps).
- **Liquid glass:** blue-tinted glass with real edge refraction in Chromium (SVG) and Firefox/Safari (WebGL).
- **Light and dark themes**, reduced-motion support, and a keyboard-friendly UI.

## Quick start

Requirements: Node.js 18+ and Yarn.

```bash
yarn install
yarn dev        # http://localhost:3000
```

| Command | What it does |
|---|---|
| `yarn dev` | Start the dev server on port 3000 |
| `yarn build` | Fetch the blog posts, then build for production into `dist/` |
| `yarn serve` | Preview the production build |
| `yarn fetch-blog` | Refresh `src/data/blog-posts.ts` from the Hashnode RSS feed |
| `yarn test` | Run Vitest (there are no tests yet) |

## Customizing

- **Your details:** `src/data/profile.ts` holds the name, role, years of experience, contact details, links, skills and
  interests used across the windows. Put your photo at `public/profile-photo.webp` and your resume at `public/resume.pdf`.
- **Wallpapers:** add images to `src/assets/wallpapers/`. Each folder is read automatically, and the file name is the label.

  | Folder | Used for |
  |---|---|
  | `desktop/home/` | Desktop wallpaper switcher |
  | `desktop/lock/` | Desktop lock screen |
  | `mobile/home/` | Mobile home screen (portrait images) |
  | `mobile/lock/` | Mobile lock screen (portrait images) |

- **Images:** use WebP. When converting photos, apply their EXIF rotation first or they can come out sideways.
  `src/assets/README.md` describes every folder.
- **Projects and blog:** projects are listed in `src/components/pages/projects.tsx`; the blog is fetched at build time
  from the Hashnode RSS feed by `scripts/fetch-blog.mjs`.

## Tech stack

- **React 19, TypeScript, Vite**, with **TanStack Router** (file-based routes in `src/routes`) and **TanStack Query**.
- **Tailwind CSS 4** and **shadcn/ui** components. Extra components come from the registries configured in
  `components.json` (`@8bitcn`, `@magicui`, `@cult-ui` and others); review anything a registry adds.
- **GSAP** and **motion** for animation, `react-rnd` for windows, `@dnd-kit` for icon dragging, `cmdk` for the palette.
- **@react-bits GlassSurface** for the liquid-glass panels (`src/components/GlassSurface.tsx`).

## Project structure

```
src/
├── components/        # Desktop, windows, dock, menus, glass panels
│   ├── pages/         # Window contents: about-me, resume, projects, blog, links, contact, terminal, achievements
│   └── ui/            # shadcn and registry components (8bit/ for the pixel variants)
├── routes/            # Lock screen (/) and desktop (/desktop)
├── lib/               # Wallpaper lists, animations, helpers
├── data/              # profile.ts and the generated blog-posts.ts
├── assets/            # Images and tracks, grouped by use
└── hooks/             # Shared hooks
docs/memory/           # Project notes: architecture, decisions, gotchas, roadmap
```

`src/data/blog-posts.ts` and `src/routeTree.gen.ts` are generated; don't edit them by hand.

## Notes

- Browsers differ on glass: Chromium bends the live page behind a panel, while Firefox and Safari bend the wallpaper
  image. See `docs/memory/gotchas.md` for details and other traps.
- The blog is refreshed daily by a GitHub Actions workflow, and the repository is mirrored to GitLab.

## License

Personal project, free to use as a reference for your own portfolio.
