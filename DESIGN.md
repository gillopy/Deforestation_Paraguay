---
name: Atlas de la Pérdida Forestal
description: Láminas de atlas nacional sobre fondo Kanagawa Dragon; los mapas satelitales son islas negras que se integran sin costura.
colors:
  primary: "#c4746e"
  dragon-yellow: "#c4b28a"
  dragon-green: "#87a987"
  link-blue: "#8ba4b0"
  neutral-bg: "#0d0c0c"
  neutral-bg-soft: "#181616"
  neutral-panel: "#1D1C19"
  ink: "#c5c9c5"
  ink-soft: "#a6a69c"
  ink-muted: "#7a8382"
  plate-black: "#000000"
  plate-text: "#c5c9c5"
  plate-muted: "#737c73"
  chart-bar: "#c4746e"
  chart-line: "#c4b28a"
  annex-paper-deep: "#E8E4D8"
  marker-hot-edge: "#DFA9A2"
  marker-ctl-edge: "#B3C4B1"
  marker-cmp-edge: "#AEBFC7"
  report-dept: "#12120f"
  print-ink: "#14202E"
  print-vermilion: "#9C2E1B"
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
  plate-sub:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.3rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  annex-caption:
    fontFamily: "Roboto Mono, ui-monospace, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.08em"
    fontFeature: "\"tnum\" 1"
  annex-note:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 400
    lineHeight: 1.65
  table-data:
    fontFamily: "Roboto Mono, ui-monospace, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"tnum\" 1"
  refs:
    fontFamily: "Roboto Mono, ui-monospace, Menlo, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    lineHeight: 1.75
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

**Creative North Star: "The Darkroom Cartographer — Kanagawa Dragon Desk"**

The article is a portfolio of national-atlas plates mounted on Kanagawa Dragon blacks, the kind a surveyor pins to a light table after a long field season. Nothing glows: the interface is archival ink rendered in reverse — light strokes on a dark field — while the satellite evidence sits on islands of pure black (`#000000`), exactly the background the Earth Engine PNGs already carry, so the raster maps mount without a seam. The 2026 update keeps that thesis but lifts it into a modern dark desk: subtle card radii (12px), soft depth, and backdrop-blurred overlays that feel like a contemporary data workspace, never like neon data-noir. The base is `dragonBlack0` (`#0d0c0c`) with panels on `dragonBlack2` (`#1D1C19`) for reading comfort over long-form.

Density is editorial: every section is a numbered **Placa** (01–05) framed by a plate marginal band and closed by a dense monospaced **colophon**. Accents are rationed like ink on a map — dragonYellow marks the frame, dragonRed marks loss, dragonGreen marks surviving forest.

**Key Characteristics:**
- Kanagawa Dragon ground (never pure black UI), light ink + modern card depth
- Raster evidence on `#000` islands; interactive UI on 12px cards with whisper shadow
- Plate-marginalia furniture: numbered plates, colophon bands, folio strips
- Monospace tabular numerals for every measured value; backdrop-blurred badges on evidence
- Desktop keeps the 42/58 sticky scrolly (now with 40px gap); mobile stacks as static plates

## Colors

The palette is Kanagawa Dragon: near-black warm grounds with muted light ink, and a set of desaturated accents that carry meaning rather than decoration. Accents are applied as frames, strokes, and data marks — never as large fills.

### Primary
- **Dragon Red** (#c4746e, ex-vermilion): loss and exclamation. Plate numbers, the active step's top band, year-change flags on the progress rail, selected-map outline, chart bars for hectares lost. Reserved for data urgency; never decorative.

### Secondary
- **Dragon Yellow** (#c4b28a, ex-ochre): the frame. Top band of resting step cards, the map legend's middle stop, link accent on dark. Dragon's yellow is already text-safe on black, so the old two-tier (base + ink) system collapses into a single canonical color, used for small labels and the CSV stamp alike.

### Tertiary
- **Dragon Green** (#87a987, ex-canopy): surviving forest and cover. The choropleth ramp's low end, the map legend's left stop.
- **Dragon Blue** (#8ba4b0, ex-sky): comparison and links. Report comparison markers, reference links.

### Neutral
- **dragonBlack0** (#0d0c0c, ex-ground): page background — warm near-black, chosen so long-form text does not fatigue the eye.
- **dragonBlack3** (#181616): secondary surfaces (scrollbar track, hover states).
- **dragonBlack2** (#1D1C19): cards, selects, and the department grid.
- **dragonWhite** (#c5c9c5, ex-ink): primary text — soft light, not clinical white.
- **dragonGray** (#a6a69c): secondary text (lede, step body).
- **dragonGray3** (#7a8382): labels, captions, colophon text.
- **Plate Black** (#000000): the satellite evidence islands — matches the PNG's native black background so rasters mount seamlessly. Unchanged by the Dragon migration (No-Seam Rule).
- **Plate Text** (#c5c9c5) / **Dragon Ash** (#737c73): caption and label text drawn on top of the plate islands.
- **Chart Bar** (#c4746e) / **Chart Line** (#c4b28a): muted Dragon data marks on dark plates.

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
**The Measure Rule.** Body copy is set at `68ch` max width (`--measure`); las columnas editoriales (introducción y Placas 06–10) se leen a `--measure-wide: 88ch`, centradas para ocupar la placa sin dejar grandes vacíos laterales, con interlineado `2.2` y margen entre párrafos de `2.5rem`.

**The Drop Cap Rule.** The first paragraph after the masthead opens with a dragonRed serif drop cap — a single editorial flourish, used once, not per-section.

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

The form language is cartographic with a modern lift: evidence plates stay sharp (`0px`) — maps and rasters cut like paper — while interactive UI uses refined radii (`card 12px`, `control 10px`, `pill 999px`) per craft-floor 12–16px guidance. The map legend keeps its 8px/ pill pill, badges and rails are pills. Lines are hairline (1px) except the two structural 2px rules (`plate-marg` / `colophon` / footer) and the scrolly step's 3px dragonYellow→dragonRed top band.

## Components

### Folio Bar
Top rule band, monospaced 10px uppercase, split left/right, `1px` bottom rule, `backdrop-blur 10px`. Names the atlas and dataset.

### Masthead
Two-column grid (`1.35fr 1fr`, gap 48px) at ≥1040px, single column below (gap 32px). Left: display title (clamp 2.5→4.4rem, -0.03em), lede, and a `dl` **folio** strip (Autor / Fuente / Periodo) as a 3-col hairline grid (`12px` card radius, panel bg, tabular numerals). Right: the **evidence plate** — black island (`12px` radius) with `44px` graticule and mono tag ("Placa 01 · evidencia / AÑO 2025 · acumulado"), image `cover` with inner radius. Lazy-loaded, only ≥1040px. Entrance: `plate-enter 0.7s` (title→lede→folio staggered).

### Plate Margin + Colophon (Placa furniture)
- **Plate margin:** flex, `2px` ink top, `1px` bottom; left dragonRed mono plate number; right muted mono meta. Max-width `var(--content-width)` with `24px` side padding, `box-sizing: border-box`.
- **Colophon:** flex-wrap, `1px` top, `2px` bottom; dense muted uppercase meta.

### Step Card (scrolly)
Panel bg (`#1D1C19`), `12px` radius, `1px` rule, `3px` top band — dragonYellow at rest, dragonRed when `is-active`. Hover lifts to `shadow-card-hover`. Contains dragonRed mono step number, serif headline, body; `.year` dragonYellow on faint yellow. Scrolly uses `gap 40px` between 42% article / 58% figure (both `min-width:0`), `is-active` snap (`0.45s` cubic) replaces the old tight padding.

### Sticky Evidence Island (scrolly figure)
Full-height black plate (`#000` + `44px` graticule, `12px` radius, `1px` plate-edge, `shadow-plate`). Holds `#storyImage` (`contain`, inner radius), top-left **image overlay** badge (pill, `overlay-bg` + `blur(10px)`, mono uppercase + dragonYellow dot), bottom-left **progress rail** (pill, same glass, three `34px` dashes, traversed = chart-line yellow; stopped frame flagged dragonRed notch via `sessionStorage`). Year change snaps (`0.18s` opacity + `0.4s` transform), not crossfade.

### Department Card (Placa 02)
Panel card (`12px` radius, `1px` rule, `overflow:hidden`, `min-width:0`). Hover: `rule-strong` + `shadow-whisper` + `translateY(-2px)`. Header `flex-wrap` (name + mono code `BOQ · …` nowrap), `12px 16px`, `1px` bottom rule; map `16/10` `cover` on `#000`; footer `12px 16px` muted. Grid `repeat(2, minmax(0,1fr))` gap 28px, `align-items:start`.

### Chart Block (Placa 03)
Black plate island (`12px` radius, `1px` plate-edge, `100% 60px` graticule, `overflow:hidden`). Bars in `chart-bar` (dragonRed) with `rx 2`, line in `chart-line` (dragonYellow), grid `12%` alpha, axis labels `plate-muted` mono 9px (`9.5px` subtitle).

### Explorer (Placa 04)
- **Map:** panel card `12px` radius, `16px` padding, `overflow:hidden`; dept paths `0.7px` `rule-strong`, hover `1.6px` ink, selected **dragonRed 2.4px stroke overlay never repaints fill**. Ramp dragonGreen→dragonYellow→dragonRed, legend scale `pill` with `overflow:hidden`.
- **Select:** `10px` radius, `1px` rule-strong, `panel` bg, light chevron SVG, `transition` border/bg, hover `ink-2`/`panel`.
- **Image panel:** black plate `12px` radius + `44px` graticule + `shadow-whisper`, `14px` padding, `overflow:hidden`; `#departmentImage` `contain` inner radius, `opacity 0.22s` crossfade; caption `plate-muted` mono tabular.
- **Stamp button:** pill, `1.5px` dragonYellow border, mono uppercase 11px, `panel` bg; hover inverts to yellow fill + `translateY(-1px)` + `0 8px 20px rgba(196,178,138,0.25)`.

### Footer
`2px` ink top rule, mono uppercase 10px, split source/tagline, flex-wrap.

### Anexo Documental (Placas 06–10, informe Planet 2016–2026)
Figuras originales del informe (PNG de fondo blanco): se montan sobre la **misma isla negra de evidencia que `.explorer-image`** — `--plate` + graticule 44px, `plate-edge`, `12px` radius, `shadow-whisper`, padding `14px`, imagen `contain` con borde interior. Caption mono `10px`: tag `Figura N · informe Planet` en `chart-line` (uppercase) y descripción en `plate-text` (`plate-muted` para el contenedor). Fuente de imágenes: `images/informe/`.

### Lectura de las Placas 06–10
A partir de la Placa 06 el texto editorial se centra en una columna `--measure-wide: 88ch` con `margin-inline: auto` (intros `.plate-intro--wide`, `.article-clip`, `.report-note`, `.findings`, `.refs`, `.plate-sub`), con interlineado `2.2` y párrafos separados por `2.5rem`. La introducción (`section.article`) comparte la misma medida y espaciado. Los títulos `h2` y los elementos de datos (grillas, tabla, mapa) conservan el ancho de placa.

### Pares Foto-Evidencia (PlanetScope)
Fotografías satelitales 3 m (800×450): van sobre isla `#000` con graticule igual que las placas, `aspect-ratio 16/9`, caption mono `--muted`. Grid `1fr 1fr` gap 28px, apilado <850px.

### Mapa de Sitios del Informe (Placa 08)
Segundo SVG (id `reportMap`) sobre `data/py.json` reutilizando `projectPoints`/`ringToPath`. Departamentos en neutro (`#12120f`, `0.7px` rule-strong — sin coropleta, el dato son los puntos). Marcadores `r 6.5`: hotspot dragonRed, control dragonGreen, comparación dragonBlue, alerta dragonYellow punteado; `tabindex/role=img/aria-label/title`, hint mono compartido (`.map-hint`). Leyenda mono con swatches circulares.

### Componentes de texto del anexo
`.report-note` (nota de fidelidad/limitación: `--bg-soft`, banda dragonYellow 3px izquierda, sans 0.84rem), `.cell-table` (mono tabular en panel con `caption` mono), `.findings` (lista con marca cuadrada dragonRed, serif `--ink-2`), `.refs` (mono 10.5px, links dragonBlue), `.plate-sub` (serif 1.3rem sobre `1px` rule).

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