# Features built

Structure: [[architecture]].

- Desktop OS interface with draggable, resizable windows, taskbar, menu bar, snap menu, music player widget, sound settings and achievements.
- Login screen, then the desktop. Sections: About Me, Resume, Projects, Blog, Links, Contact, Terminal, Achievements. GSAP animations; mobile icon layout.
- Projects window lists the author's projects including Steam Games Analysis and Malware Classifier (with its Streamlit demo and repo link); the terminal's `projects.txt` lists six projects.
- Blog reads Hashnode posts from a bundled file refreshed at build time and by a daily workflow.
- Contact and links point to the new accounts: email `ahmad.w.kanaan@proton.me`, GitHub `github.com/Haruru0-0/...`.
- First-run cue on the desktop: "Double-click an icon to open it" fades in under the greeting after ~2s and stays hidden once the `first_window` achievement is unlocked. Desktop icons also open with Enter.
- Window content pass (2026-11-12): Resume is two columns when the window is 760px wide or more; Blog search filters posts; Projects carousel shows the three newest, the grid lists all; Contact map shows Beirut; Links lists only GitHub, LinkedIn and the blog.
- Links window is a link-in-bio page: header with photo and "Open to opportunities", Find me rows (GitHub, LinkedIn, Email, Blog, Resume PDF), the three latest Hashnode posts, and five repo cards.
- Ctrl/Cmd+K command palette (`src/components/CommandMenu.tsx`, opened from the menu bar too): opens any app, copies the email, downloads the resume. Resume has a Career path timeline; Achievements uses `XpBar` and a `QuestLog` "Trophy Case".
- Liquid-glass search panel (Ctrl/Cmd+K) and a glass right-click desktop menu (open app, command palette, sort/reset icons, sound toggle, theme). Terminal has `shell` and `showreel` tabs (animated typed commands; `showreel` command too). Links, Projects grid and Blog cards use the spotlight `MagicCard`. Sound settings use a pixel Switch.
- Wallpaper switcher: "Wallpaper" group in the Ctrl/Cmd+K palette and a Wallpaper submenu in the desktop right-click menu (thumbnails, "Next wallpaper"); the choice is saved in `localStorage` (`portfolio-wallpaper`). Mobile wallpaper is fixed.
- `WallpaperText.tsx` samples the wallpaper pixels under a label (canvas, matching the `object-cover` crop) and picks light or dark text for contrast; it uses `useWallpaper` and `useWallpaperChoice`.
- The mobile 2x2 control panel (`MobileControlTiles.tsx`) grows on hover or press with the same bouncy padding (`p-1` to `p-2`). The command palette (`p-2` to `p-3`) and the right-click menu with its submenus (`p-1.5` to `p-2.5`) grow on hover the same way.
- Desktop achievement toast grows on hover (padding `p-3` to `p-4`, same bouncy curve as the lock-screen settings button; off with reduced motion). The mobile pill does not.
- Dock magnification (macOS style): icons grow with cursor distance and the dock widens (`Taskbar.tsx`, `motion` springs, sizes 50 to 84px). Off on touch screens and with reduced motion; the overflow menu list does not magnify.
- Sound settings use a frosted `GlassSwitch` (`ui/glass-switch.tsx`). The site has a thin blue custom scrollbar (`styles.css`: webkit pseudo-elements for Chromium/Safari, `scrollbar-width`/`scrollbar-color` for Firefox/Zen). The search panel has a deeper blue tint, a light rim and a shadow so it stands out; the dialog overlay is `bg-slate-950/60`.
- Mobile home screen: the folder holds all 8 apps (page 1 About, Resume, Projects, Blog; page 2 Links, Contact, Achievements, Terminal). Beside the puppy picture is a 2x2 control grid (Sound, Theme, Wallpaper, Search) of app-icon-style tiles. Wallpaper opens a glass sheet of thumbnails; Search opens the command palette. Mobile has its own wallpaper list and saved choice.
- Lock screen wallpaper switcher: a settings button at the bottom right of the lock screen opens a glass panel of thumbnails (hidden once the login card shows). The home screen can change the lock wallpaper too: a "Lock screen" group in the command palette, a "Lock screen" submenu in the right-click menu, and Home screen / Lock screen tabs in the mobile Wallpaper sheet.
- All badges share one glass-blue pill style (`.pixel-badge` in `styles.css`: rounded, thin tinted border, normal-case text, hover glow); the Resume timeline and the Achievements quest log use the plain `ui/badge` with that class instead of `ui/8bit/badge`. Cards and buttons keep the square pixel look.
