---
name: Atlas de la Pérdida Forestal
description: Láminas de atlas nacional sobre fondo nocturno cálido; los mapas satelitales son islas negras que se integran sin costura.
colors:
  primary: "#E2553E"
  expedition-ochre: "#D6A92E"
  forest-canopy: "#6FAD78"
  link-sky: "#6FB8DE"
  neutral-bg: "#0A0E14"
  neutral-bg-soft: "#121823"
  neutral-panel: "#0E1420"
  ink: "#E7E3DA"
  ink-soft: "#B8BCC4"
  ink-muted: "#8A919E"
  plate-black: "#000000"
  plate-text: "#E9E2D2"
  plate-muted: "#A79E8B"
  chart-bar: "#F06A52"
  chart-line: "#FFC94A"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.5rem, 5.4vw, 4.4rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "Roboto Mono, ui-monospace, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
    fontFeature: "\"tnum\" 1"
rounded:
  sharp: "0px"
  sm: "8px"
  card: "12px"
  control: "10px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "28px"
  xl: "48px"
  section: "88px"
components:
  folio-stat:
    backgroundColor: "{colors.neutral-panel}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "20px 22px"
  step-card:
    backgroundColor: "{colors.neutral-panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px 26px 26px"
  chart-block:
    backgroundColor: "{colors.plate-black}"
    textColor: "{colors.plate-text}"
    rounded: "{rounded.card}"
    padding: "16px 16px 12px"
  explorer-select:
    backgroundColor: "{colors.neutral-panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 36px 11px 12px"
  stamp-button:
    backgroundColor: "{colors.neutral-panel}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "12px 18px"
---

# Design System: Atlas de la Pérdida Forestal

## Overview

**Creative North Star: "The Darkroom Cartographer — Modern Night Desk"**

The article is a portfolio of national-atlas plates mounted on a warm nocturnal ground, the kind a surveyor pins to a light table after a long field season. Nothing glows: the interface is archival ink rendered in reverse — light strokes on a dark field — while the satellite evidence sits on islands of pure black (`#000000`), exactly the background the Earth Engine PNGs already carry, so the raster maps mount without a seam. The 2026 update keeps that thesis but lifts it into a modern dark desk: subtle card radii (12px), soft depth, and backdrop-blurred overlays that feel like a contemporary data workspace, never like neon data-noir. The base remains warm charcoal (`#0A0E14`) for reading comfort over long-form.

Density is editorial: every section is a numbered **Placa** (01–05) framed by a plate marginal band and closed by a dense monospaced **colophon**. Accents are rationed like ink on a map — ochre marks the frame, vermilion marks loss, canopy marks surviving forest.

**Key Characteristics:**
- Warm dark ground (never pure black UI), light cartographic ink + modern card depth
- Raster evidence on `#000` islands; interactive UI on 12px cards with whisper shadow
- Plate-marginalia furniture: numbered plates, colophon bands, folio strips
- Monospace tabular numerals for every measured value; backdrop-blurred badges on evidence
- Desktop keeps the 42/58 sticky scrolly (now with 40px gap); mobile stacks as static plates

## Colors

The palette splits into a warm nocturnal ground with light "ink" text, and a set of expedition accents that carry meaning rather than decoration. Accents are applied as frames, strokes, and data marks — never as large fills.

### Primary
- **Signal Vermilion** (#E2553E): loss and exclamation. Plate numbers, the active step's top band, year-change flags on the progress rail, selected-map outline, chart bars for hectares lost. Reserved for data urgency; never decorative.

### Secondary
- **Expedition Ochre** (#D6A92E): the expedition frame. Top band of resting step cards, the map legend's middle stop, link accent on dark. Its deep text-safe sibling **Ochre Ink** (#E5C158) is used for small ochre labels and the CSV stamp.

### Tertiary
- **Forest Canopy** (#6FAD78): surviving forest and cover. The choropleth ramp's low end, the map legend's left stop.

### Neutral
- **Nocturnal Ground** (#0A0E14): page background — warm charcoal, not pure black, chosen so long-form text does not fatigue the eye.
- **Raised Ground** (#121823): secondary surfaces (scrollbar track, hover states).
- **Panel** (#0E1420): cards, selects, and the department grid.
- **Ink** (#E7E3DA): primary text — warm light, not clinical white.
- **Ink Soft** (#B8BCC4): secondary text (lede, step body).
- **Ink Muted** (#8A919E): labels, captions, colophon text (≥4.5:1 on ground).
- **Plate Black** (#000000): the satellite evidence islands — matches the PNG's native black background so rasters mount seamlessly.
- **Plate Text** (#E9E2D2) / **Plate Muted** (#A79E8B): caption and label text drawn on top of the plate islands.
- **Chart Bar** (#F06A52) / **Chart Line** (#FFC94A): high-luminance data marks chosen for dark plates.

### Named Rules
**The No-Seam Rule.** Every raster must sit on `plate-black` (`#000000`), never on a near-black. The PNGs export with a pure-black background; any other value shows a seam where the image ends.

**The Rationed Ink Rule.** Accents mark data and frames only. A colored surface that does not encode loss, cover, or selection is a mistake.

## Typography

**Display Font:** Source Serif 4 (with Georgia, Times New Roman fallbacks)
**Body Font:** Source Serif 4 (with Georgia fallback)
**Label/Mono Font:** Roboto Mono (with ui-monospace, Menlo fallbacks)
**Sans UI Font:** Inter (with Helvetica Neue, Arial fallback)

**Character:** A scholarly serif (Source Serif 4) carries the editorial voice in display and body — a face with genuine journal credibility rather than a default "editorial" serif. Roboto Mono is reserved for measurement: labels, catalog metadata, colophons, axis ticks, and every figure, with tabular numerals so columns of hectares align. Inter is the workhorse for small UI text and controls.

### Hierarchy
- **Display** (600, `clamp(2.5rem, 5.4vw, 4.4rem)`, 1.02, `-0.03em`): the masthead title only, balanced with `text-wrap: balance`.
- **Headline** (600, `clamp(1.7rem, 3.4vw, 2.4rem)`, 1.15, `-0.02em`): plate titles (`Placa 02…05`).
- **Article Headline** (600, `clamp(1.6rem, 3vw, 2.1rem)`, 1.2): in-flow article headings.
- **Step Headline** (600, 1.55rem, 1.22): scrolly step titles.
- **Title** (600, 1rem): card titles (department names, chart-box names).
- **Body** (400, 1.0625rem, 1.8): article and step prose; max measure 68ch, `text-wrap: pretty`.
- **Label** (500, 10px, uppercase, `0.10–0.16em`, tabular numerals): folio bar, plate numbers, colophons, captions, axis labels, map hints.

### Named Rules
**The Measure Rule.** Body copy is set at `68ch` max width (`--measure`); the intro column may widen to `var(--measure) + 8ch`.

**The Drop Cap Rule.** The first paragraph after the masthead opens with a vermilion serif drop cap — a single editorial flourish, used once, not per-section.

## Layout

A centered `--content-width: 1120px` column with `--measure: 68ch` for reading. Vertical rhythm on 8pt (gaps 24–28px, paddings 12–24px, plate separation 88px, `box-sizing: border-box` everywhere). Every **Placa** has the same furniture: `plate-marg` (`2px` ink top, `1px` bottom, `24px` side padding, `box-sizing`) and `colophon` (`1px` top, `2px` bottom).

The scrollytelling section (`Placa 01`) is full-bleed (`plate-bleed: max-width:none` with inner `max-width: var(--content-width)`). Desktop keeps the 42/58 split with a `40px` gap — article steps left (`min-width:0`), sticky plate island right (`top:88px`, `calc(100vh -128px)`, `max-height 860px`, `12px` radius). Below 850px the scrolly stacks: steps become static blocks with inline images (`12px` radius), and the sticky figure is removed. Breakpoints: 980 (masthead/explorer collapse), 850 (scrolly/stack + 2→1 column grids), 600 (compact type, 1-col folio).

## Elevation & Depth

The system is layered, not flat: tonal steps (ground → raised → panel) plus three soft shadows and one backdrop-blur for overlays. No hard offset shadows; no glowing borders.

### Shadow Vocabulary
- **Whisper** (`0 10px 30px rgba(0,0,0,0.35)`): floating cards — step cards, explorer images, department cards at rest.
- **Card Hover** (`0 16px 40px rgba(0,0,0,0.45)`): lifted state on hover (department cards, active step).
- **Plate** (`0 24px 60px rgba(0,0,0,0.6)`): evidence islands — the sticky satellite figure and masthead plate.
- **Overlay Blur** (`backdrop-filter: blur(10px)` on `rgba(11,21,36,0.78)`): image overlay badge and progress rail — modern glass without losing the atlas texture.

### Named Rules
**The Layered Depth Rule.** Panels sit on tonal steps; shadows mark only lifted or evidence surfaces. Overlays use blur, not opacity alone, to keep the graticule readable. Reduced-motion collapses blur and lift.

## Shapes

The form language is cartographic with a modern lift: evidence plates stay sharp (`0px`) — maps and rasters cut like paper — while interactive UI uses refined radii (`card 12px`, `control 10px`, `pill 999px`) per craft-floor 12–16px guidance. The map legend keeps its 8px/ pill pill, badges and rails are pills. Lines are hairline (1px) except the two structural 2px rules (`plate-marg` / `colophon` / footer) and the scrolly step's 3px ochre→vermilion top band.

## Components

### Folio Bar
Top rule band, monospaced 10px uppercase, split left/right, `1px` bottom rule, `backdrop-blur 10px`. Names the atlas and dataset.

### Masthead
Two-column grid (`1.35fr 1fr`, gap 48px) at ≥1040px, single column below (gap 32px). Left: display title (clamp 2.5→4.4rem, -0.03em), lede, and a `dl` **folio** strip (Autor / Fuente / Periodo) as a 3-col hairline grid (`12px` card radius, panel bg, tabular numerals). Right: the **evidence plate** — black island (`12px` radius) with `44px` graticule and mono tag ("Placa 01 · evidencia / AÑO 2025 · acumulado"), image `cover` with inner radius. Lazy-loaded, only ≥1040px. Entrance: `plate-enter 0.7s` (title→lede→folio staggered).

### Plate Margin + Colophon (Placa furniture)
- **Plate margin:** flex, `2px` ink top, `1px` bottom; left vermilion mono plate number; right muted mono meta. Max-width `var(--content-width)` with `24px` side padding, `box-sizing: border-box`.
- **Colophon:** flex-wrap, `1px` top, `2px` bottom; dense muted uppercase meta.

### Step Card (scrolly)
Panel bg (`#0E1420`), `12px` radius, `1px` rule, `3px` top band — ochre at rest, vermilion when `is-active`. Hover lifts to `shadow-card-hover`. Contains vermilion mono step number, serif headline, body; `.year` ochre-ink on faint ochre. Scrolly uses `gap 40px` between 42% article / 58% figure (both `min-width:0`), `is-active` snap (`0.45s` cubic) replaces the old tight padding.

### Sticky Evidence Island (scrolly figure)
Full-height black plate (`#000` + `44px` graticule, `12px` radius, `1px` plate-edge, `shadow-plate`). Holds `#storyImage` (`contain`, inner radius), top-left **image overlay** badge (pill, `overlay-bg` + `blur(10px)`, mono uppercase + yellow dot), bottom-left **progress rail** (pill, same glass, three `34px` dashes, traversed = chart-line yellow; stopped frame flagged vermilion notch via `sessionStorage`). Year change snaps (`0.18s` opacity + `0.4s` transform), not crossfade.

### Department Card (Placa 02)
Panel card (`12px` radius, `1px` rule, `overflow:hidden`, `min-width:0`). Hover: `rule-strong` + `shadow-whisper` + `translateY(-2px)`. Header `flex-wrap` (name + mono code `BOQ · …` nowrap), `12px 16px`, `1px` bottom rule; map `16/10` `cover` on `#000`; footer `12px 16px` muted. Grid `repeat(2, minmax(0,1fr))` gap 28px, `align-items:start`.

### Chart Block (Placa 03)
Black plate island (`12px` radius, `1px` plate-edge, `100% 60px` graticule, `overflow:hidden`). Bars in `chart-bar` (vermilion-high) with `rx 2`, line in `chart-line` yellow, grid `12%` alpha, axis labels `plate-muted` mono 9px (`9.5px` subtitle).

### Explorer (Placa 04)
- **Map:** panel card `12px` radius, `16px` padding, `overflow:hidden`; dept paths `0.7px` `rule-strong`, hover `1.6px` ink, selected **vermilion 2.4px stroke overlay never repaints fill**. Ramp canopy→ochre→vermilion, legend scale `pill` with `overflow:hidden`.
- **Select:** `10px` radius, `1px` rule-strong, `panel` bg, light chevron SVG, `transition` border/bg, hover `ink-2`/`panel`.
- **Image panel:** black plate `12px` radius + `44px` graticule + `shadow-whisper`, `14px` padding, `overflow:hidden`; `#departmentImage` `contain` inner radius, `opacity 0.22s` crossfade; caption `plate-muted` mono tabular.
- **Stamp button:** pill, `1.5px` ochre-ink border, mono uppercase 11px, `panel` bg; hover inverts to ochre fill + `translateY(-1px)` + `0 8px 20px rgba(214,169,46,0.25)`.

### Footer
`2px` ink top rule, mono uppercase 10px, split source/tagline, flex-wrap.

## Do's and Don'ts

### Do:
- **Do** mount every satellite raster on `#000000` (`--plate`) so the PNG's native black background disappears into the plate.
- **Do** set every measured number in tabular-numeral Roboto Mono (statistics, colophons, axis ticks, captions).
- **Do** keep the 42/58 sticky scrolly on desktop and fall back to stacked static plates below 850px.
- **Do** use the choropleth selection as a stroke overlay only — never recolor a department's fill to indicate selection.
- **Do** honor `prefers-reduced-motion` (the year snap collapses to an instant swap).
- **Do** keep the print stylesheet in light ink on white paper for export.

### Don't:
- **Don't** put an accent color on a large surface that doesn't encode data (loss, cover, or selection).
- **Don't** use near-black plate values like `#0B1524` behind rasters — only exact `#000`.
- **Don't** crossfade the scrolly year change; it snaps on a fixed course (a single authored motion, not a collection of fades).
- **Don't** reintroduce the kicker/eyebrow pattern above headings — plate numbers and marginalia carry that information instead.
- **Don't** round plate corners; the system is sharp-squared except the 8px legend pill.