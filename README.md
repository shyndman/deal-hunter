# deal-hunter

Two halves of one workflow:

1. **The skill** (`skills/deal-hunter/`) — drives the *shopping*: recon, brief, hunt across stores via camoufox, normalize to landed CAD, rank. Symlinked into `~/.omp/agent/skills/deal-hunter`.
2. **The viewer** (this repo's app) — turns a hunt's structured output into an interactive, DigiKey-style report you can slice, sort, filter, and chart yourself.

The skill *finds* products and emits data. The viewer *renders* it. They meet at one JSON contract.

## The artifact model

The bloat in an interactive report is the library code, not the data. So we externalize the code and inline the data:

- **Viewer** — our app compiled to one hosted, **versioned** JS+CSS bundle. The reusable software.
- **Report** — a small HTML file the skill generates: long-form prose (verdict, winner, educational tangents) as plain markup, the hunt data as one `<script type="application/json" id="report-data">…</script>` block, and a pinned `<script src>`/`<link>` at the hosted viewer, which mounts the interactive band/table/chart into a placeholder.

Why this shape:
- **Editable after the fact** — the report is prose + a delimited data block + two tags. No minified blob to scroll past.
- **Self-contained** — inline data opens from `file://`, no CORS, one file to share.
- **Cheap to generate** — the "build" is template + inject JSON.

## Stack

- **crossfilter2** (Apache-2.0) — filter state core. `isElementFiltered(i)` / `allFiltered()` give the matching set for free.
- **Tabulator** (MIT) — the table widget: sort (incl. multi-column), column reorder/resize. Fully restyleable.
- **ECharts** (Apache-2.0) — the chart. `visualMap.outOfRange.opacity` does **dim-not-remove** as a config knob.
- **Facet band** — ours. Schema-driven inline full-width control row (chips + range sliders w/ match counts) above the table+chart. No library does this generically.

Division of labour: **crossfilter owns filtering** (drives table contents + chart dimming); **Tabulator owns display** (sort/reorder/resize, fed the already-filtered rows); the **facet band** is the novel reusable part.

## Hosting

Serve the viewer bundle from this repo via **jsDelivr** (correct MIME + CDN + tag-pinnable):

```
https://cdn.jsdelivr.net/gh/shyndman/deal-hunter@<tag>/dist/viewer.js
```

Do **not** use `raw.githubusercontent.com` — it serves `text/plain` with `nosniff`, so browsers refuse to execute it as a script.

**Pin the viewer version per generated report.** Reports are long-lived; pointing at `@latest` means a future viewer refactor silently breaks every past report. Pin a tag at generation time.

## Data contract

Schema-driven so the viewer is category-agnostic (hard drives today, a T-ball set tomorrow). Three types:

```ts
// One listing: a table row and a chart point.
interface Item {
  id: string;        // first 5 chars of hash(url) — dedupe + chart-point ↔ row
  title: string;
  price: number;     // item only, CAD — no shipping
  shipping: number;  // CAD (0 = free)
  duty?: number;     // customs estimate CAD, kept separate, never in price
  venue: string;
  seller?: string;
  url: string;
  flags: Flag[];
  attrs: Record<string, string | number | boolean>;  // category-specific
}

interface Flag { icon: string; kind: "good" | "warn"; label?: string; }

// Declares one axis the facet band and chart can use.
interface Facet {
  id: string;        // "price" | "capacityTB" | "pricePerTB" …
  label: string;
  type: "numeric" | "categorical" | "boolean";
  unit?: string;     // "CAD", "TB", "$/TB"
}

interface Report {
  items: Item[];
  facets: Facet[];
  chart?: { x: string; y: string };  // facet ids; default = first two numeric
}
```

- **Spine vs `attrs`** — the spine is the fields every product has; `attrs` holds the category-specific ones. A `Facet.id` resolves against the spine first, then `attrs`, so `price` is both a table column and a filterable/chartable axis with no special-casing.
- **Derived** — `landed = price + shipping`; duty is shown beside it, never folded in.
- **Flags** — the hunter's editorial annotations on a row (★ best, ⚠ caution): structured data lives in facets, judgment lives in flags.

## Open questions

- Generator: thin CLI (`data.json` in, HTML out) vs the skill filling a template directly.
- The skill's interface to all this — how the agent produces data and triggers report generation.
