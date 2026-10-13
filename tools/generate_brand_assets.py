"""Derive the site's brand assets from the supplied Elite Forums logo files.

Run from the project root:

    python tools/generate_brand_assets.py

Source art lives in `brand/` (both files are 500x500 and share the same geometry,
one in each colour direction):

    brand/elite-forums-dark-on-light.png -> black mark, used to build the alpha mask
    brand/elite-forums-light-on-dark.png -> white mark, the supplied dark-surface lockup

Bands measured from the source files:

    mark      y  63-322, x 100-399
    wordmark  y 367-398, x  21-490
    tagline   y 412-427, x  91-419

Outputs:

    src/assets/logo-mark-{ink,light}.png        mark only, transparent
    src/assets/logo-lockup-{ink,light}.png      mark above wordmark, transparent
    src/assets/logo-horizontal-{ink,light}.png  mark beside wordmark, transparent
    public/favicon.ico / favicon.png            mark on the brand's near-black square
    public/apple-touch-icon.png
"""

from __future__ import annotations

import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "brand"
OUT_ASSETS = ROOT / "src" / "assets"
OUT_PUBLIC = ROOT / "public"

MASK_SOURCE = SRC_DIR / "elite-forums-dark-on-light.png"

MARK_BOX = (100, 63, 400, 323)  # left, top, right, bottom
WORDMARK_BOX = (21, 367, 491, 399)
LOCKUP_BOX = (21, 63, 491, 399)  # mark + wordmark stacked, tagline excluded

INK = (9, 9, 9)
LIGHT = (255, 255, 255)

# Matches --background in src/styles.css: oklch(0.12 0 0) ~ #0d0d0d
BRAND_BG = (10, 10, 10)


def alpha_from(path: Path) -> np.ndarray:
    """Return a 0-255 coverage map for the dark artwork in `path`."""
    lum = np.asarray(Image.open(path).convert("RGB"), dtype=np.float32).mean(axis=2)
    ink = 255.0 - lum
    ink = np.clip((ink - ink.min()) / max(ink.max() - ink.min(), 1e-6) * 255.0, 0, 255)
    return ink.astype(np.uint8)


def crop(alpha: np.ndarray, box: tuple[int, int, int, int], pad: int = 2) -> np.ndarray:
    x0, y0, x1, y1 = box
    h, w = alpha.shape
    return alpha[max(y0 - pad, 0) : min(y1 + pad, h), max(x0 - pad, 0) : min(x1 + pad, w)]


def tint(alpha: np.ndarray, rgb: tuple[int, int, int]) -> Image.Image:
    h, w = alpha.shape
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = rgb
    rgba[..., 3] = alpha
    return Image.fromarray(rgba, "RGBA")


def horizontal_alpha(
    mark: np.ndarray,
    word: np.ndarray,
    text_h: int = 22,
    mark_ratio: float = 2.9,
    gap_ratio: float = 0.34,
) -> np.ndarray:
    """Lay the mark and the wordmark out side by side, optically centred."""
    mark_img = Image.fromarray(mark, mode="L")
    word_img = Image.fromarray(word, mode="L")

    word_scale = text_h / word_img.height
    word_img = word_img.resize((max(1, round(word_img.width * word_scale)), text_h), Image.LANCZOS)
    mark_h = round(text_h * mark_ratio)
    mark_scale = mark_h / mark_img.height
    mark_img = mark_img.resize((max(1, round(mark_img.width * mark_scale)), mark_h), Image.LANCZOS)

    gap = round(text_h * gap_ratio)
    height = max(mark_img.height, word_img.height)
    width = mark_img.width + gap + word_img.width
    canvas = Image.new("L", (width, height), 0)
    canvas.paste(mark_img, (0, (height - mark_img.height) // 2))
    canvas.paste(word_img, (mark_img.width + gap, (height - word_img.height) // 2))
    return np.asarray(canvas)


def rounded_square(size: int, bg: tuple[int, int, int], radius_ratio: float = 0.2) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).rounded_rectangle(
        (0, 0, size - 1, size - 1), radius=int(size * radius_ratio), fill=(*bg, 255)
    )
    return canvas


def compose_icon(mark: Image.Image, size: int, bg: tuple[int, int, int]) -> Image.Image:
    canvas = rounded_square(size, bg)
    inner = int(size * 0.66)
    scale = inner / max(mark.size)
    scaled = mark.resize(
        (max(1, round(mark.width * scale)), max(1, round(mark.height * scale))), Image.LANCZOS
    )
    canvas.alpha_composite(scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2))
    return canvas


def main() -> None:
    OUT_ASSETS.mkdir(parents=True, exist_ok=True)
    OUT_PUBLIC.mkdir(parents=True, exist_ok=True)

    alpha = alpha_from(MASK_SOURCE)
    mark = crop(alpha, MARK_BOX)
    wordmark = crop(alpha, WORDMARK_BOX)
    lockup = crop(alpha, LOCKUP_BOX)
    horizontal = horizontal_alpha(mark, wordmark)

    variants: dict[str, tuple[np.ndarray, tuple[int, int, int]]] = {
        "logo-mark-ink.png": (mark, INK),
        "logo-mark-light.png": (mark, LIGHT),
        "logo-lockup-ink.png": (lockup, INK),
        "logo-lockup-light.png": (lockup, LIGHT),
        "logo-horizontal-ink.png": (horizontal, INK),
        "logo-horizontal-light.png": (horizontal, LIGHT),
    }
    for name, (data, colour) in variants.items():
        image = tint(data, colour)
        image.save(OUT_ASSETS / name)
        print(f"src/assets/{name:<28} {image.size[0]}x{image.size[1]}")

    icon = compose_icon(tint(mark, LIGHT), 512, BRAND_BG)
    icon.save(OUT_PUBLIC / "favicon.png")
    icon.resize((180, 180), Image.LANCZOS).save(OUT_PUBLIC / "apple-touch-icon.png")
    icon.save(
        OUT_PUBLIC / "favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )
    for name in ("favicon.ico", "favicon.png", "apple-touch-icon.png"):
        print(f"public/{name:<28} {os.path.getsize(OUT_PUBLIC / name)} bytes")


if __name__ == "__main__":
    main()
