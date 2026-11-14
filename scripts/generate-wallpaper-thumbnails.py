"""Run after adding or replacing wallpapers: python scripts/generate-wallpaper-thumbnails.py"""
from pathlib import Path
from PIL import Image, ImageOps

assets = Path(__file__).resolve().parents[1] / "src" / "assets"
source = assets / "wallpapers"
count = 0
for path in source.glob("*/*/*"):
    if path.suffix.lower() not in {".webp", ".avif", ".jpg", ".jpeg", ".png"}:
        continue
    target = assets / "wallpaper-thumbnails" / path.relative_to(source).with_suffix(".webp")
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(path) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        mobile = path.relative_to(source).parts[0] == "mobile"
        image.thumbnail((128, 228) if mobile else (192, 342), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=64 if mobile else 76, method=6)
    count += 1
print(f"Generated {count} lightweight wallpaper thumbnails.")
