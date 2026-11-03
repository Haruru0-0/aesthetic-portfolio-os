# Architecture

See [[features-built]] and [[gotchas]].

A portfolio site that looks like a desktop operating system. Vite + React + TypeScript, TanStack Router (generated `routeTree.gen.ts`), Tailwind CSS, GSAP, `@dnd-kit` for dragging, Vitest for tests.

- `src/routes/`: `__root.tsx`, `index.tsx`, `desktop.tsx` (the desktop).
- `src/components/`: `Desktop`, `Window`, `Taskbar`, `MenuBar`, `Icon`, `MobileIcon`, `SnapMenu`, `MusicPlayerWidget`, sound, audio, achievement and theme contexts; `ui/` (shadcn).
- `src/components/pages/`: the window contents: `about-me`, `resume`, `projects`, `blog`, `links`, `contact`, `terminal`, `achievements`.
- `src/data/blog-posts.ts`: **generated** by `scripts/fetch-blog.mjs` from `https://ahmadkanaan.hashnode.dev/rss.xml`. `src/lib/hashnode.ts` re-exports it as `fetchBlogPosts()`.
- CI: `.github/workflows/mirror-to-gitlab.yml` (mirror on push and nightly) and `refresh-blog.yml` (daily 04:23 UTC; commits `src/data/blog-posts.ts` if the feed changed).

## Scripts
`yarn dev` (port 3000), `yarn build` (runs `fetch-blog` first via `prebuild`, then `vite build && tsc`), `yarn serve`, `yarn test`, `yarn fetch-blog`.
