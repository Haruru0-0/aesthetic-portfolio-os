# Wallpaper thumbnails

Small WebP previews for menus and the mobile picker. Full-size backgrounds stay in `../wallpapers`.

Mobile previews fit within 128 x 228 pixels at quality 64; desktop previews retain their 192 x 342 maximum at quality 76.

After adding or replacing a wallpaper, regenerate previews from the project root:

```sh
python scripts/generate-wallpaper-thumbnails.py
```

Requires Pillow. Paths mirror `wallpapers/<device>/<home-or-lock>/<filename>`, using `.webp` for previews. Wallpapers without a generated preview fall back to the original image.
