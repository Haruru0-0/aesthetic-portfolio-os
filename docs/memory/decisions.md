# Decisions

- **2026-11-13: design consistency fixes.** Filled Contact/Projects actions use `--cute-on-text`; Contact and Blog fields keep a visible themed focus ring. Blog header layout follows measured app-window width; Resume entry dates stack. About, Resume and Links share `.portfolio-section-title` and 32px section spacing. Resume's timeline inherits the portfolio typeface and blue theme instead of its imported retro/neutral styling.

- **2026-11-02: blog posts come from the free Hashnode RSS feed, fetched at build time,** because Hashnode's GraphQL API became paid (Pro) on 2026-05-13 and the feed has no CORS headers, so the browser cannot read it. The build keeps the previous file if the download fails.
- **2026-11-02: contact email and GitHub links moved to the new account** (`Haruru0-0`); Malware Classifier added as a project and to the terminal.
- **Mirrored to GitLab** by a workflow on every push and nightly (script lives in the dev-tools repo).
- **PortaGen** is a separate project that generalises this site for other people; changes here may be ported there.
- **2026-11-12: design review (impeccable + ui-ux-pro-max) accessibility pass.** Window controls, desktop icons, music player buttons and mobile page dots got accessible names; windows have a labelled content region; desktop toasts are offset below the menu bar. Bounce easing was kept on purpose for the playful tone, and icon labels were not widened (they still truncate).
- **2026-11-12: removed placeholder Twitter, Instagram, YouTube, Bookmarks and example.com links; "5+ years" replaces "4 years"** (work dates start Jan 2021); testimonials in About are kept as placeholders until the owner supplies real ones.
- **2026-11-12: added shadcn registries** with pixel/retro and animation components (`@pixelact-ui`, `@8bitcn`, `@retroui`, `@magicui`, `@aceternity`, `@cult-ui`) to source components that fit the pixel theme.
- **2026-11-12: wallpapers changed from CSS backgrounds to `<img>`** so GlassSurface can refract them with WebGL in browsers without SVG backdrop filters (the old `filter: url(#glass-distortion)` glass only bent the background in Chromium).
- **2026-11-12: GlassSurface for panels, CSS glass for small repeated items** (desktop and mobile icons, playlist rows, the GSAP-resized mobile toast): per-instance SVG filters and WebGL canvases are too heavy for many small elements. Desktop icons stay on CSS glass by the owner's choice.
- **2026-11-13: all `src/assets` pictures converted to WebP** (lossless for pixel-art PNGs, quality 86 for photos, animated WebP with the original frame timings for GIFs); the `.mp4` files and `public/` icons were left as they were.
