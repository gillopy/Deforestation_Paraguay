# -*- coding: utf-8 -*-
"""
optimize_images.py
==================

Convert the heavy source images served by the static site into lightweight
WebP files, so pages load fast, while the originals stay untouched for
download.

Scope:
  - scrollytelling maps (Placa 01)   -> images/scrolly/
  - informe Planet figures (Placa 07) -> images/informe/ (same name, .webp)
  - Placa 02 comparison maps          -> already served from images/mapas/

The source files are NEVER modified or deleted. Output is rewritten only when
the source is newer than the target (idempotent).

Usage:
    python optimize_images.py
    python optimize_images.py --quality 82
    python optimize_images.py --dry-run
"""

import argparse
import os
import re
import sys

from PIL import Image

REPO = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(REPO, "images")
INDEX = os.path.join(REPO, "index.html")

# Explicit jobs: (source relative to images/, target relative to images/).
EXPLICIT_JOBS = [
    (
        "map_export_Alto_Paraguay_Boquerón_combined_forest_change_year_2_high_res.png",
        "scrolly/alto_paraguay_boqueron_year_2002.webp",
    ),
    (
        "map_export_Alto_Paraguay_Boquerón_combined_forest_change_year_10_high_res.png",
        "scrolly/alto_paraguay_boqueron_year_2010.webp",
    ),
    (
        "map_export_Alto_Paraguay_Boquerón_combined_forest_change_year_25_high_res.png",
        "scrolly/alto_paraguay_boqueron_year_2025.webp",
    ),
]


def informe_jobs():
    """Every images/informe/* that index.html still references as an image."""
    if not os.path.isfile(INDEX):
        return []
    html = open(INDEX, encoding="utf-8").read()
    refs = sorted(set(re.findall(r'src="(images/informe/[^"]+)"', html)))
    jobs = []
    for ref in refs:
        rel = ref[len("images/"):]
        base, _ext = os.path.splitext(rel)
        jobs.append((rel, base + ".webp"))
    return jobs


def human(n):
    return "{:.2f} MB".format(n / 1_048_576)


def convert(source, target, quality, dry_run):
    if not os.path.isfile(source):
        print("  MISSING SOURCE: {}".format(source))
        return None

    if os.path.isfile(target) and os.path.getmtime(target) >= os.path.getmtime(source):
        print("  up to date: {}".format(os.path.relpath(target, REPO)))
        return None

    src_size = os.path.getsize(source)
    if dry_run:
        print("  would convert: {} ({} KB)".format(
            os.path.relpath(target, REPO), round(src_size / 1024)))
        return None

    os.makedirs(os.path.dirname(target), exist_ok=True)

    with Image.open(source) as im:
        if im.mode == "RGBA" and im.getchannel("A").getextrema() == (255, 255):
            im = im.convert("RGB")
        im.save(target, "WEBP", quality=quality, method=6)

    dst_size = os.path.getsize(target)
    print("  {} -> {}  ({:.1f} % smaller)".format(
        human(src_size), human(dst_size), (1 - dst_size / src_size) * 100))
    return (src_size, dst_size)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Optimize site images to WebP.")
    parser.add_argument("--quality", type=int, default=80)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    jobs = EXPLICIT_JOBS + informe_jobs()
    print("WebP quality: {}  |  {} job(s)\n".format(args.quality, len(jobs)))

    total_src = total_dst = 0
    for src_rel, dst_rel in jobs:
        source = os.path.join(IMAGES, src_rel)
        target = os.path.join(IMAGES, dst_rel)
        print(os.path.basename(src_rel))
        result = convert(source, target, args.quality, args.dry_run)
        if result:
            total_src += result[0]
            total_dst += result[1]

    if total_dst:
        print("\nTOTAL: {} -> {}  ({:.1f} % smaller)".format(
            human(total_src), human(total_dst),
            (1 - total_dst / total_src) * 100))
    return 0


if __name__ == "__main__":
    sys.exit(main())
