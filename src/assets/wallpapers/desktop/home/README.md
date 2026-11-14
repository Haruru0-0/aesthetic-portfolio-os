# Desktop home wallpapers (the switcher)

Drop images here (`.webp` preferred, also `.avif`, `.jpg`, `.png`). They appear
automatically under "Wallpaper" in the command palette (Ctrl/Cmd+K) and the desktop
right-click menu. The file name is the label: `city-at-night.webp` shows as "City At Night".
`lilies-night` is the default until a visitor picks another (set `DEFAULT_ID` in `src/lib/wallpapers.ts`); their choice is remembered in the browser.

Use landscape images around 1920x1080. Convert with any tool, for example Pillow:
`python -c "from PIL import Image; Image.open('in.jpg').convert('RGB').save('out.webp', quality=86)"`
