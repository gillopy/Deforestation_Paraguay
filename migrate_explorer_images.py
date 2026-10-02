# -*- coding: utf-8 -*-
"""
migrate_explorer_images.py
==========================

Phase F3 of the image optimization plan: split the explorer department maps
into an optimized set (WebP, served by the site) and a download set (original
PNG, fetched by the "download image" button).

Layout after this script runs:

    images/mapas/<slug>_<layer>.webp      <- served by the explorer
    images/downloads/<slug>_<layer>.png   <- downloaded on demand

What it does:
  1. Reads data/paraguay_deforestacion.json to get the department slugs.
  2. MOVES images/<slug>_<layer>.png -> images/downloads/<slug>_<layer>.png
     (safe: these 54 files are used only by the explorer).
  3. Generates images/mapas/<slug>_<layer>.webp from the moved PNG.
  4. Removes the now-redundant `images` object from the JSON
     (the JS rebuilds the path from slug + layer).

Idempotent: re-running it after a completed migration is a no-op for moved
files and only regenerates a WebP when the PNG is newer.

Usage:
    python migrate_explorer_images.py --dry-run
    python migrate_explorer_images.py
"""

import argparse
import json
import os
import shutil
import sys

from PIL import Image

REPO = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(REPO, "images")
MAPAS = os.path.join(IMAGES, "mapas")
DOWNLOADS = os.path.join(IMAGES, "downloads")
JSON_PATH = os.path.join(REPO, "data", "paraguay_deforestacion.json")

LAYERS = ["cover", "loss", "combined"]


def human(n):
    return "{:.2f} MB".format(n / 1_048_576)


def load_slugs():
    with open(JSON_PATH, encoding="utf-8") as handle:
        data = json.load(handle)
    return [d["slug"] for d in data["departments"]], data


def main(argv=None):
    parser = argparse.ArgumentParser(description="Split explorer maps into mapas/ (webp) and downloads/ (png).")
    parser.add_argument("--quality", type=int, default=80)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    slugs, data = load_slugs()

    if not args.dry_run:
        os.makedirs(MAPAS, exist_ok=True)
        os.makedirs(DOWNLOADS, exist_ok=True)

    moved = converted = 0
    total_src = total_dst = 0
    missing = []

    for slug in slugs:
        for layer in LAYERS:
            name = "{}_{}.png".format(slug, layer)
            src = os.path.join(IMAGES, name)
            dst_png = os.path.join(DOWNLOADS, name)
            dst_webp = os.path.join(MAPAS, "{}_{}.webp".format(slug, layer))

            # 1) move the original PNG into downloads/ (unless already moved)
            if os.path.isfile(src):
                if args.dry_run:
                    print("  move: {} -> downloads/".format(name))
                else:
                    shutil.move(src, dst_png)
                moved += 1
            elif not os.path.isfile(dst_png):
                missing.append(name)
                continue

            # 2) generate the WebP from the downloaded PNG
            if args.dry_run:
                print("  webp: {} -> mapas/{}_{}.webp".format(name, slug, layer))
                continue

            if os.path.isfile(dst_webp) and os.path.getmtime(dst_webp) >= os.path.getmtime(dst_png):
                continue

            with Image.open(dst_png) as im:
                if im.mode == "RGBA" and im.getchannel("A").getextrema() == (255, 255):
                    im = im.convert("RGB")
                im.save(dst_webp, "WEBP", quality=args.quality, method=6)
            converted += 1
            total_src += os.path.getsize(dst_png)
            total_dst += os.path.getsize(dst_webp)

    # 3) strip the redundant `images` object from the JSON
    if not args.dry_run:
        changed = False
        for dep in data["departments"]:
            if "images" in dep:
                del dep["images"]
                changed = True
        if changed:
            with open(JSON_PATH, "w", encoding="utf-8", newline="\n") as handle:
                json.dump(data, handle, ensure_ascii=False, indent=2)
                handle.write("\n")

    print("\nmoved PNG -> downloads/: {}".format(moved))
    print("webp generated: {}".format(converted))
    if total_src:
        print("webp total: {} -> {} ({:.1f} % smaller)".format(
            human(total_src), human(total_dst), (1 - total_dst / total_src) * 100))
    if missing:
        print("\nMISSING (no PNG found anywhere):")
        for m in missing:
            print("  " + m)
    return 0


if __name__ == "__main__":
    sys.exit(main())
