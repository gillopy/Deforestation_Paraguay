# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/vanilla JS, no build step. Deployed as plain files on any static host (`python -m http.server` locally). This constraint is binding: the redesign must ship as static assets only.

## Users

Readers of a Spanish-language data-journalism piece (Guillermo Cabrera, periodismo de datos). They arrive to understand how forest cover disappeared in Paraguayan departments, especially Boquerón and Alto Paraguay, 2001–2025. Inferred from `README.md` and `index.html` copy; confirmed by user brief.

## Product Purpose

A scrollytelling article that turns Hansen Global Forest Change v1.13 data into a visual narrative: hero, intro, national stats, a three-moment year sequence (2002/2010/2025), per-department charts of loss and CO₂e emissions, and an interactive department explorer with a choropleth map. Success = a reader finishes the story, understands the spatial pattern, and can download the underlying CSV.

## Positioning

Real Earth Engine statistics (not demo data: `data/paraguay_deforestacion.json` `is_demo_data: false`) presented department-by-department in Spanish, with exportable source data.

## Operating Context

Produced by an offline Python pipeline (`hansen_export_pipeline.py`, Google Earth Engine + geemap, run in Colab) that emits `data/` and `images/`; the site consumes those static files. No backend, no API keys at runtime.

## Capabilities and Constraints

- Must remain dependency-light: Scrollama (CDN), Google Fonts (Inter, Lora, Roboto Mono); local vanilla JS parses CSV/JSON/GeoJSON and renders SVG charts/map by hand.
- Data contracts that must not break: `CONFIG.storyImages`/`CONFIG.jsonPath`/`CONFIG.imagePath` in `assets/js/main.js`, `data/*.csv` column names, `data/py.json`, image filenames in `images/`.
- Editorial copy (author credit, methodology text, numeric claims) is factual; redesign must not alter claims or invent new ones.
- User-pinned redesign decisions (binding): editorial paper background, calm scientific tone that does not fatigue the eye, balance mobile-first with the current desktop sticky scrolly (which the user likes and wants preserved), National Geographic as visual reference, impeccable-only (no Stitch project).

## Brand Commitments

Voice: sober data journalism in Spanish (voseo forms in UI text). Author byline "Guillermo Cabrera · Periodismo de datos · Hansen Global Forest Change 2025 v1.13" stays. User pinned NatGeo editorial-paper as the reference world.

## Evidence on Hand

- `data/paraguay_deforestacion.json` / `.csv` — national and 18-department loss stats, 2001–2025.
- `data/boqueron_tree_cover_loss.csv`, `data/boqueron_primary_forest_loss.csv`, `data/alto_paraguay_tree_cover_loss.csv`, `data/alto_paraguay_primary_forest_loss.csv` — GFW loss + gross CO₂e emissions series.
- `data/py.json` — department polygons (GeoJSON).
- `images/` — exported PNG map plates (combined/cover/loss per department + three high-res year slices for scrollytelling).
- No photography, testimonials, or external press. Future work must not fabricate them.

## Product Principles

1. Data fidelity first: visuals interpret, never distort, the Earth Engine numbers.
2. Reading comfort over spectacle: long-form legibility is the core experience.
3. Evidence as artifact: maps and charts are presented like field specimens, captioned and sourced.
4. Static and portable: every feature must work from plain files, offline-capable host.

## Accessibility & Inclusion

Spanish-language content; map paths are keyboard-operable with aria-labels; charts carry `role="img"` labels. Redesign must keep or improve WCAG AA contrast (new risk: paper-ground contrast choices).
