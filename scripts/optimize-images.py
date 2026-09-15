"""Create responsive WebP photography from the untouched supplied JPEG files.

Run from any directory with Python 3 and Pillow installed:
    python scripts/optimize-images.py

The size suffix is the maximum width, never a request to upscale a source.
No color adjustments, retouching, or aesthetic changes are applied.
"""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Public" / "Images"
DESTINATION = ROOT / "static" / "images"


def main() -> None:
    original_bytes = 0
    generated_bytes = 0
    count = 0
    for source in sorted(SOURCE.rglob("*.jpg")):
        category = source.parent.name
        destination = DESTINATION / category
        destination.mkdir(parents=True, exist_ok=True)
        original_bytes += source.stat().st_size
        with Image.open(source) as opened:
            photo = ImageOps.exif_transpose(opened).convert("RGB")
            for max_width in (640, 1200, 1800) if category == "sebastian" else (640, 1200):
                width = min(max_width, photo.width)
                height = round(photo.height * width / photo.width)
                resized = photo.resize((width, height), Image.Resampling.LANCZOS)
                output = destination / f"{source.stem}-{max_width}.webp"
                resized.save(output, "WEBP", quality=82, method=6)
                generated_bytes += output.stat().st_size
                count += 1
                print(f"{output.relative_to(ROOT)}: {width}x{height}, {output.stat().st_size:,} bytes")

    # A photographic fallback for social sharing. Crop keeps all three people
    # and the handshake visible; production sharing metadata needs an absolute URL.
    with Image.open(SOURCE / "sebastian" / "clients.jpg") as opened:
        photo = ImageOps.exif_transpose(opened).convert("RGB")
        preview = ImageOps.fit(photo, (1200, 630), Image.Resampling.LANCZOS, centering=(0.5, 0.45))
        preview.save(ROOT / "static" / "social-preview.jpg", quality=85, optimize=True)

    print(f"\nOriginal photos: {original_bytes:,} bytes")
    print(f"Responsive assets ({count} variants): {generated_bytes:,} bytes")
    print("Source files remain unchanged.")


if __name__ == "__main__":
    main()
