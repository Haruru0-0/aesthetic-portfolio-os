# Roadmap

Open items only; what exists is in [[features-built]].

- Build the site and check it visually after the 2026-11-02 changes (blog data, Malware Classifier, links).
- Refresh the code map with `python -m graphify update .` after larger changes.
- Add `public/profile-photo.jpg` and `public/resume.pdf` (referenced from `src/data/profile.ts`; the avatar falls back to initials and Download PDF is a dead link until then).
- Confirm the real LinkedIn URL (`profile.ts` has a TODO) and replace the placeholder testimonials in `about-me.tsx` with real quotes.
- Check the command palette, Resume timeline and Achievements visually after restarting the dev server; the 8bit components use default shadcn colour tokens, not `--cute-*`. Not yet installed: `@pixelact-ui/context-menu`, `@8bitcn/audio-settings`, `@magicui/dock`, `@cult-ui/terminal-animation`, Projects cards.
- Not yet installed: `@magicui/dock` for the taskbar. The shadcn `ui/context-menu` is used for the desktop menu; the registry context-menus were not needed.
- Dock: re-measure smoothness of the magnification on a real GPU browser; optional launch bounce for an opening app.
- Mobile wallpapers: five portrait home images exist (`jellyfish` plus four named ones); add more to `src/assets/wallpapers/mobile/home/` if wanted. Check the control tiles and picker sheet on a real phone and in Zen (the sheet's glass edges looked busy in the emulator).
- Lock wallpapers: each lock folder has only one image; add more (landscape for desktop, portrait for mobile). The lock screen settings button was checked on desktop only, not at phone size.
- Cleanup still open: pre-existing unused files (`use-animation-frame` and `use-scroll-throttle` hooks, `reportWebVitals.ts`, `query-provider.tsx`) and the emoji skill icons on Resume. There are no automated tests. The glass UI, wallpaper and asset work is committed and pushed to `main`; the untracked `output/` folder (wallpaper originals and upscales, about 31 MB) is deliberately not in the repo.
