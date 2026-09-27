# ODD — Chaco Atlas editorial refactor

**Feature:** `chaco-atlas-editorial-refactor`
**Repo:** `paraguay-deforestacion-hansen` (branch at start: `master`, commit `cdec59b`)
**Locale / artifact language:** Spanish, neutral professional (the site is a Spanish-language
data-journalism artefact; the persona voice applies to chat only, never to the page copy).

## Objective

Rewrite the narrative copy of `index.html` so it reads as professional data journalism instead of
generated filler, and so every figure it states is traceable to a file in this repository.

## Problem

The copy has the hallmarks of LLM authoring: mood assertions instead of observations
("cuesta imaginar", "el bosque todavía parece intacto", "un paisaje redibujado"), decorative
either/or constructions ("no es solo cuánto… sino cómo y dónde"), self-narration about the page
("Esta visualización reconstruye…", "Pasá de una imagen a otra y seguí con tus propios ojos"), and
em-dash aphorisms. Worse, several assertions are contradicted by the very image next to them or by
the site's own data files.

## Why

The author asked for: (a) prose that no longer reads as AI-generated, (b) professional commentary on
the dataset, (c) enriched findings that actually tell the story of the map sequence, (d) validated or
improved chart commentary, and (e) a better-framed reading of the annexed Planet Labs AI report.

## Route and scope

| Task | Route | Trigger evidence |
| --- | --- | --- |
| T1 data + pipeline extraction | delegated (`explore`) | mapping trigger: understanding needed 10+ data/code files |
| T2 front-end behaviour map | delegated (`explore`) | mapping trigger: main.js 1787 lines + styles.css 2070 lines |
| T3 image series verification | inline (bash + canvas sampling + visual read) | needs the actual pixels; not delegable without losing the observation |
| T4 copy rewrite of `index.html` | inline | single file; the editorial voice is the deliverable, not mechanical |
| T5 baseline capture + browser verification | inline | verification of a static page |

**Authorized scope:** content of `index.html` only. No CSS, no JS, no data files, no images.
Layout classes, element ids, `data-*` attributes and duplicated JS strings must survive byte-intact.

## Findings that drive the rewrite (all verified)

**F1 — The page told the reader two different truths.** `index.html` mixes two aggregations of the
same Hansen v1.13 series:

| | project pipeline (`data/paraguay_deforestacion.json`) | GFW CSVs (`data/*_tree_cover_loss.csv`) |
| --- | --- | --- |
| Boquerón loss 2001–2025 | 3.245.165 ha · **45,89 %** | 2.933.892 ha · 41,49 % |
| Alto Paraguay loss | 2.165.089 ha · **31,55 %** | 1.933.911 ha · 28,18 % |
| BOQ+ALP share of national | **65,35 %** ("casi dos tercios") | 58,81 % |
| Emissions | not present | 524,87 Mt / 486,64 Mt |
| Worst year | BOQ 2012 = 243.141 ha; ALP 2010 = 156.092 ha | BOQ 2012 = 227.485 ha; ALP 2010 = 156.092 ha |

The prose used the CSV numbers, while the map fill, `#legendMin/Max`, every aria-label,
`#departmentCaption`, the ranking claim and the downloadable CSV all use the JSON numbers.
"42 %" matched neither source. The prose contradicts the map drawn directly beneath it.

**Decision (recorded, reversible):** anchor the narrative to the **project pipeline**, because that
is what the page displays everywhere else, what the reader can download, and what the pixel evidence
corroborates (F3). Label the GFW series as its own in Placa 03, and explain the gap once.
Open item: the ~10 % gap is itself a defect — see *Risks*.

**F2 — Unsupported claims and wrong captions.**

- `"el área total de ese bosque primario se redujo 23 %"` — no primary-forest baseline exists in any
  file. Removed.
- `"superficie restante en % de 2001"` (3 captions) — no such column exists. Removed.
- The four tick lists `'01 '04 '07 '09 '11 '13 '15 '17 '19 '21 '25` — `renderLossChart` emits
  **6** labels: `'01 '06 '11 '16 '21 '25`. Corrected.
- `"18 departamentos"` ×2 — the 18 GeoJSON features are **17 departments + Asunción**. Corrected.
- `"Exportación 1600 px"` — 1600 px is the pipeline's department-image width; the `map_export_*`
  frames are **2841 × 2900 px**. Corrected.
- `"2,9 Mha, una superficie equivalente a Bélgica"` — Belgium is 3.068.900 ha. Removed.
- `"informe satelital independiente"` — the annex is a Planet Labs **AI-generated** analysis that
  shares Hansen as its base source. Re-framed.
- `"Alto Paraguay … 17,9 %"` — 17,957 % rounds to **18,0 %**.

**F3 — The image series is cumulative and its baseline was not pristine.** Verified by sampling
28.728 points across `year_0`, `year_02`, `year_25` (canvas, step 17 px):

| frame | green | dark | warm (loss) | blue (gain) |
| --- | --- | --- | --- | --- |
| `year_0` | 53,7 % | 46,3 % | **0 %** | 0,1 % |
| `year_02` | ~53 % | 46,2 % | **0,88 %** | 0,1 % |
| `year_25` | 32,5 % | 45,0 % | **22,5 %** | 0,1 % |

`y00 → y25`: 21,2 % of sampled area went green→warm, 45,0 % stayed dark, 32,5 % stayed green.
So: `year_0` **is** the 2000 baseline and the series **is** cumulative — the "acumulado" caption is
correct and the scrollytelling premise holds. But **46,3 % of the mapped area was already below the
30 % canopy threshold in 2000**, half of it natural (savanna, wetlands — the organic dark shapes
that never take a loss colour) and half an unmistakably rectilinear paddock grid. Every figure
below the threshold is invisible to this dataset. The line *"2002: el bosque todavía parece
intacto"* is therefore contradicted by its own image.

**F4 — Visual signature worth naming.** Loss appears as rectilinear paddock blocks in grid
formation with thin retained strips and a dense road mesh (mechanised ranching; `Ley 422/73`
cortinas); it wraps around the wetland and watercourse shapes instead of crossing them; gain
(blue) is ~0,1 % and flat, i.e. effectively permanent conversion inside this window; and a large
late loss mass appears only in the final frames in the north (Alto Paraguay), matching a
2019 spike (176.042 ha, ~3× the 53.494 ha of 2018).

**F5 — The same accumulated map is displayed four times.** `year_25` is loaded by the masthead and
by Placa 01 step 3 (literally the same file), and `boqueron_combined.png` /
`alto_paraguay_combined.png` in Placa 02 render the same palette and the same accumulated loss as
the two halves of that frame. Placa 02 therefore has to earn its place with a quantitative
comparison, not with two more maps.

**F6 — Weight.** `images/` holds 161 MB of PNG, of which the page requests ~19 MB; the 26
`map_export_*` files are 2841 × 2900 px (~4,8 MB each) for panels that render at most ~1400 CSS px.

## Checklist

- [x] T1 · Extract exact figures from JSON, all four CSVs, the pipeline and `py.json`
- [x] T2 · Map `main.js` behaviour and the CSS class inventory; list the ids/attrs that must not change
- [x] T3 · Verify `map_export_*` semantics from the pixels (cumulative? baseline?) and plate-02 redundancy
- [x] T4a · Correct `<title>`/meta/masthead numbers and the lede
- [x] T4b · Rewrite the opening `article` block, including the 2000-baseline caveat (F3)
- [x] T4c · Rewrite the three scrollytelling steps from what the frames actually show (F3, F4)
- [x] T4d · Rewrite the ranking block; fix "18 departamentos" (F2)
- [x] T4e · Rewrite Placa 02 as a two-department quantitative comparison (F5) with corrected cards
- [x] T4f · Rewrite the four chart contexts; fix tick lists; add the two-denominator note (F1, F2)
- [x] T4g · Rewrite Placa 05 method copy with real limits (F3) and the pipeline/GFW split (F1)
- [x] T4h · Re-frame Placa 06: disclose that the annex is an AI-generated analysis, separate measured figures from interpretation (F2)
- [x] T4i · Light rewrite of Placas 07–10: tighten, attribute, fix the 17,9 % → 18,0 % and the findings list
- [x] T4j · Add the provenance HTML comment block
- [x] T5 · Re-render the page in a browser and check console + both denominators
- [ ] Commit — pending explicit user request (see *Next step*)

## Acceptance criteria

1. No sentence asserts a mood the adjacent image or data does not show.
2. Every figure in the copy resolves to `data/paraguay_deforestacion.json` or a named CSV, and the
   two aggregations are never mixed inside one claim.
3. The four removed/unverifiable claims (23 %, "restante en % de 2001", the 11-tick list, "18
   departamentos") are gone or corrected.
4. `index.html` still renders with zero console errors, both maps, all four charts and the scroller.
5. No id, class, `data-*` attribute or JS-read string changed.

## Checks

`python -m http.server` over the repo root → load `index.html` → console clean, 4 charts drawn,
2 SVG maps drawn, `#statConcentration` renders `65,3% del total` (exact 65,349 %, one
decimal), legend renders `2,5%`–`45,9%`, the four charts emit the 6 x-labels `2001 2006 2011
2016 2021 2025`.
No test suite exists in this repository (`README.md` and the file inventory confirm it), so checks
are functional/visual plus the numeric reconciliation above.

### Verification evidence (2026-09-27, Playwright over `http://127.0.0.1:8802/index.html`)

| Probe | Observed | Expected |
| --- | --- | --- |
| console errors (page) | 0 (the only error was `favicon.ico` on an unrelated scratch server) | 0 |
| `.chart-bar` / `.chart-line-point` | 100 / 100 | 4 charts × 25 years |
| `.chart-error` inserted | 0 | 0 |
| chart x-labels | `2001 2006 2011 2016 2021 2025` | the corrected meta line |
| `#departmentMap .dept-path` | 18 | 18 |
| `#reportMap .report-marker` / `.report-dept` | 9 / 18 | 9 / 18 |
| `#statConcentration` | `65,3% del total` | matches the lede |
| `#legendMin` / `#legendMax` | `2,5%` / `45,9%` | unchanged |
| `#departmentCaption` | `Boquerón · Capa combinada · cobertura 2000: 7.070.871 ha · pérdida acumulada: 3.245.165 ha (45,9%)` | matches the Placa 02 card prose exactly |
| `#storyImage` / `#imageYear` / `#railCaption` | `year_2` / `AÑO 2002 · …` / `2002` | scrollytelling intact |
| `#departmentSelect option` | 19 | 18 units + placeholder |
| new `.report-note` (Placa 03) | 768 px wide, 13,44 px, ochre left border | same computed style as the other notes |

`git diff --stat`: `index.html | 313 insertions(+), 195 deletions(-)` — no other tracked file touched.

### Side effect found and reverted

An editor hook (`.agents/skills/impeccable/scripts/hook-before-edit.mjs`, fired by the edits to
`index.html`) appended `odd/` and `.atl/` to `.gitignore` without being asked. That is an
unrequested modification to a tracked file, so `.gitignore` was restored with
`git checkout -- .gitignore`. Consequence to decide on: while those two lines are absent, this task
document and `.atl/` show up as untracked rather than ignored.

## Risks

- **R1 (open, highest):** the ~10 % divergence between the project pipeline and GFW is unexplained.
  Hypothesis, **not verified**: `export_stats` applies `CANOPY_THRESHOLD=30` to the cover total but
  sums the raw `loss` band without re-applying the canopy mask, which would over-count loss on
  1–30 % canopy pixels and inflate the project figure. Must be confirmed against the Earth Engine
  code before publication; if the pipeline is wrong, every project figure on the page — including
  the map colours — has to be regenerated.
- **R2:** `paraguay_deforestacion.partial.json` is a byte-identical duplicate of the full file.
  Divergence risk, not a numeric error. Left untouched (out of scope).
- **R3:** the primary-forest CSVs carry the *same header* as the tree-cover CSVs, so the only thing
  identifying them as primary forest is the filename. Noted in the copy; the file itself is a
  data-layer fix.
- **R4:** "Reproducción con permiso de figuras y citas · 2026-09-05" in Placa 06 is an unverifiable
  licensing assertion. Left as authored, flagged to the author rather than silently changed.

## Next step

Delivered: `index.html` rewritten and verified. Working tree left with `index.html` modified and no
commit created — branch + Conventional Commit offered, not executed, since the user did not ask for
one.

Open for the author to decide:

1. **R1** — confirm whether `export_stats` in `hansen_export_pipeline.py` re-applies the 30 %
   canopy mask to the loss total. If it does not, the project figures (and the map colours built
   from them) are inflated and have to be regenerated; until then the copy keeps the project
   figures but labels them as the project's own aggregation.
2. Whether to re-add `odd/` and `.atl/` to `.gitignore` (see *Side effect found and reverted*).
3. **F6** — the 26 `map_export_*` frames ship at 2841 × 2900 px (~4,8 MB each) for panels that
   render at most ~1400 CSS px. Re-exporting at ~1600 px would cut roughly 80 % of the image weight.
4. **F5** — the accumulated map still appears in the masthead, in Placa 01 step 3 and, split in two,
   in Placa 02. The copy now differentiates them, but a future pass could drop one of the two
   `year_25` instances entirely.
5. `index.html` still mixes a formal register in the prose with voseo in two short UI strings
   (`"Seleccionar departamento"` and `"Pasá el cursor o hacé clic sobre un departamento."`). Those
   two are duplicated verbatim in `assets/js/main.js` (lines 544 and 951), so normalising them
   requires touching a second file and bumping `main.js?v=`. Left out of scope deliberately.
6. `assets/js/main.js` line 1583 still carries the comment "los 18 departamentos" (17 + Asunción).
   Code comment only, no user impact; left untouched to keep the change to one file.
