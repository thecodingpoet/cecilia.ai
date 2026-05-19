#!/usr/bin/env python3
"""Generate placeholder product images for frontend/public/products/."""

import json
import struct
import zlib
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_JSON = _REPO_ROOT / "data" / "products.json"
OUTPUT_DIR = _REPO_ROOT / "frontend" / "public" / "products"

CATEGORY_COLORS = {
    "Electronics": (45, 55, 72),
    "Home & Kitchen": (72, 85, 99),
    "Furniture": (101, 84, 63),
    "Sports & Fitness": (34, 84, 61),
    "Books & Media": (91, 60, 115),
    "Accessories": (120, 53, 53),
}


def _png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    chunk = chunk_type + data
    crc = zlib.crc32(chunk) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + chunk + struct.pack(">I", crc)


def write_placeholder_png(path: Path, product_id: str, category: str) -> None:
    width, height = 400, 300
    r, g, b = CATEGORY_COLORS.get(category, (60, 60, 60))
    # Slight variation from product id hash
    h = sum(ord(c) for c in product_id)
    r = min(255, r + (h % 40))
    g = min(255, g + ((h // 3) % 40))
    b = min(255, b + ((h // 7) % 40))

    raw_rows = []
    for y in range(height):
        row = bytes([0])  # filter byte
        for x in range(width):
            edge = x < 8 or y < 8 or x >= width - 8 or y >= height - 8
            if edge:
                row += bytes([max(0, r - 25), max(0, g - 25), max(0, b - 25)])
            else:
                row += bytes([r, g, b])
        raw_rows.append(row)

    compressed = zlib.compress(b"".join(raw_rows), 9)
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n"
    png += _png_chunk(b"IHDR", ihdr)
    png += _png_chunk(b"IDAT", compressed)
    png += _png_chunk(b"IEND", b"")
    path.write_bytes(png)


def main() -> None:
    with open(PRODUCTS_JSON) as f:
        products = json.load(f)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for product in products:
        pid = product["product_id"]
        category = product.get("category", "")
        out = OUTPUT_DIR / f"{pid}.jpg"
        # Write PNG bytes with .jpg extension — browsers render by content.
        # Keeps plan's /products/{id}.jpg URL convention without Pillow.
        write_placeholder_png(out, pid, category)
        print(f"Wrote {out.name}")

    print(f"Generated {len(products)} placeholders in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
