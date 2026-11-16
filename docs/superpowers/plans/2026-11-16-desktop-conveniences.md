# Desktop conveniences implementation plan

Goal: add an in-site app switcher, persistent desktop layouts, and optional timed wallpaper rotation.

Architecture: keep session/layout storage separate from rendering; use shared wallpaper-selection hooks for timers and shared controls in existing pickers. Keep window animations unchanged.

- [x] Validate and persist window geometry and open-app sessions; restore safely within the current viewport without letting mobile overwrite desktop geometry.
- [x] Add focus requests and a glass app switcher with a menu-bar button and Alt+Backquote cycling. Preserve drafts while changing active windows.
- [x] Add per-wallpaper-set rotation preferences, pause hidden/inactive timers, and expose presets from 30 seconds to one hour in desktop and mobile pickers.
- [x] Verify storage validation and timer cleanup with unit tests; verify switching, reloads, geometry, rotation controls, and responsive layouts in the browser; run TypeScript and production build.

Constraints: no new dependencies, preserve pixel app content/glass desktop controls, respect reduced motion, keep Alt+Tab for the operating system. Storage failures must not stop the app.
