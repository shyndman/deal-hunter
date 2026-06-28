# deal-hunter

Two halves of one workflow:

1. **The skill** (`skills/deal-hunter/`) — drives the *shopping*: recon, brief, hunt across stores via camoufox, normalize to landed CAD, rank. Symlinked into `~/.omp/agent/skills/deal-hunter`.
2. **The report** — turns a hunt's structured output into an interactive, DigiKey-style page you can slice, sort, filter, and chart yourself. Authored by the companion `deal-reporter` skill.

The skill *finds* products and emits data; the report *renders* it. They meet at one schema (below).

## `design/report.html` — the design reference

`design/report.html` is a **design artifact**. It is the *look* and the *content shape* we're matching — nothing more. It happens to be a Claude Design export (a self-unpacking React bundle), but its format, libraries, and bundling are **irrelevant**: it is **not** a technology choice and we are **not** building with its toolchain. Read it for exactly two things:

- **Appearance is gospel.** Match it. Any visible departure is a deliberate, flagged design decision — never drift, never "close enough."
- **Content shape is the target.** Similar sections, similar depth — see the anatomy below.

## Report anatomy

Nine sections, top to bottom. The menu is fixed; **presence is data-driven** — a section renders only when it has real content (the ladder hides when degenerate, an educational aside appears only when there's a genuine one, and so on). This is what keeps a fixed menu from being prescriptive.

1. **Masthead** — identity only: category, the spec-envelope title, search date, ship-to + currency. Derivation details (the FX *rate*, the duty *code*) live in the methodology, not here.
2. **Process** — a brief, experiential narrative of how the hunt went ("big stores → a couple Toronto print shops → widened to scrap yards"). The shape, not the inventory; the exhaustive venue list lives in the methodology.
3. **Verdict** — the call: a one-line thesis, an optional figures callout, a supporting paragraph.
4. **Picks** — highlighted standouts (e.g. "the value play", "best single drive"): kicker, title, rationale, an authored headline figure.
5. **Ladder** — a *value ladder*: cheapest-acceptable per variant, ranked by a value metric. The metric defaults to plain price and upgrades to price-per-unit when a "more-is-better" quantity exists (the agent picks the unit — TB, not MB-of-cache). Hidden when it would collapse to a single number.
6. **Education** — asides explaining what the numbers can't. Each is title + prose + an optional point list. Bespoke illustrations (the SAS-vs-SATA diagram, etc.) are **hand-added after generation**, not modeled in the schema.
7. **Sellers** — "where the best rows come from": the standout merchants behind the listings.
8. **Slice the field** — the interactive core: a facet band (chips + range sliders with live match counts) driving a sortable, reorderable table **and** a scatter chart, where filtered-out rows **dim to ~16%, not disappear** — you keep the whole field in view while matches pop.
9. **Methodology** — the receipts: the structured hunt record (sites searched, per-site results, errors, the brief, FX + cost assumptions, totals, exclusions).

## Stack

Section 8 is built from three libraries plus one hand-rolled part — chosen by source-verified research scoring candidates against seven requirements, the critical one being **dim-not-remove**:

- **crossfilter2** (Apache-2.0) — filter-state core. `isElementFiltered(i)` / `allFiltered()` hand back the matching set for free; it dims rather than drops.
- **Tabulator** (MIT) — the table widget: sort (incl. multi-column), column reorder/resize. Fully restyleable, fed the already-filtered rows.
- **ECharts** (Apache-2.0) — the chart. `visualMap.outOfRange.opacity` does **dim-not-remove** as a config knob, no custom point-filtering.
- **Facet band** — ours. A schema-driven full-width control row (chips + range sliders with match counts) above the table+chart. No library does this generically.

Division of labour: **crossfilter owns filtering** (drives table contents *and* chart dimming); **Tabulator owns display**; **ECharts owns the chart**; the **facet band** is the novel reusable part wiring them to the schema.

## Data contract

Schema-driven so the report is category-agnostic (hard drives today, a T-ball set tomorrow). The skill emits one `Report`:

```ts
interface Report {
  identity: Identity;        // masthead
  process: string;           // brief experiential narrative (prose)
  verdict: Verdict;
  picks: Pick[];             // highlighted standouts
  ladder?: Ladder;           // value ladder — omitted when degenerate
  education: Section[];      // educational asides
  sellers: Seller[];         // "where the best rows come from"
  items: Item[];             // interactive table + chart rows
  facets: Facet[];           // axes for band / chart / sort
  chart?: { x: string; y: string };   // facet ids; default = first two numeric
  method: Method;            // the structured hunt record (receipts)
}

// ─── masthead (identity only) ─────────────────────────────────
interface Identity {
  category: string;          // "Enterprise HDD"  (eyebrow)
  title: string;             // "8 / 12 / 16 TB · 7200 RPM · 3.5″ Enterprise HDD"  (spec envelope)
  searched: string;          // ISO date
  shipTo: string;            // "Toronto"
  currency: string;          // "CAD"
}

// ─── authored prose blocks ────────────────────────────────────
interface Verdict {
  thesis: string;            // the one-liner
  callout?: { title: string; figures: Figure[] };  // e.g. "THE INTERFACE TAX" + numbers
  body: string;              // supporting paragraph
}
interface Figure { value: string; label: string; }   // "−C$80–120" / "per drive vs the SATA twin"

interface Pick {
  kicker: string;            // "THE VALUE PLAY"
  title: string;             // "12 TB SAS, used"
  note: string;              // one-line rationale
  headline: string;          // authored emphasis: "~$30 /TB all-in"
  itemId?: string;           // link back to the Item it spotlights
}

interface Section {          // one educational aside
  title: string;
  body: string;
  points?: Point[];          // feature tiles AND attribute lists collapse to this
}
interface Point { label: string; detail: string; key?: string; }  // key = "#22" etc.

// ─── value ladder ─────────────────────────────────────────────
interface Ladder {
  metric: { label: string; unit?: string };   // "$/TB"; unit absent ⇒ plain price
  rows: LadderRow[];
}
interface LadderRow {
  group: string;             // "16TB SAS"  (the variant)
  landed: number;
  perUnit?: number;          // 30 ($/TB); absent when metric is plain price
  note: string;              // "used · Vancouver"
  best?: boolean;
}

// ─── sellers ──────────────────────────────────────────────────
interface Seller {
  venue: string;             // "eBay"
  tag?: string;              // "THE PICK" / "CHEAPEST" / "GRADE A"
  handle: string;
  positivePct: string;       // "100%"
  ratings: string;           // "792" / "4.8K"
  country: string;           // "🇨🇦" / "CA"
  note: string;              // "Vancouver, BC — domestic, no border"
}

// ─── the interactive set ──────────────────────────────────────
interface Item {
  id: string;                // first 5 chars of hash(url) — dedupe + chart-point ↔ row
  title: string;
  price: number;             // item only, CAD — no shipping
  shipping: number;          // CAD (0 = free)
  duty?: number;             // customs estimate CAD, kept separate, never in price
  venue: string;
  seller?: string;
  url: string;
  flags: Flag[];
  attrs: Record<string, string | number | boolean>;  // category-specific
}
interface Flag { icon: string; kind: "good" | "warn"; label?: string; }
interface Facet {
  id: string;                // "price" | "capacityTB" | "pricePerTB" …
  label: string;
  type: "numeric" | "categorical" | "boolean";
  unit?: string;             // "CAD", "TB", "$/TB"
}

// ─── the hunt record (receipts; methodology section) ──────────
interface Method {
  brief: Brief;
  venues: VenueResult[];
  fx: { rate: number; base: string; quote: string; source: string; at: string };
  costs: { hstPct: number; dutyHsCode?: string; dutyFree: boolean; brokerageRange?: string };
  totals: { found: number; kept: number; duplicates: number };
  excluded?: Excluded[];     // what was found and cut — the richest mining seam
}
interface Brief {
  specEnvelope: string;
  hardRequirements: string[];
  niceToHaves: string[];
  shipTo: string;
  currency: string;
}
interface VenueResult {
  venue: string;
  domain?: string;
  queries: string[];         // the *how*, not just the *where*
  status: "ok" | "blocked" | "zero-results" | "parse-error" | "dead";
  found: number;
  kept: number;
}
interface Excluded { title: string; venue?: string; reason: string; }
```

Notes:
- **Two kinds of content.** `items`/`facets` and the structured `method` are *data the renderer lays out*; `verdict`, `process`, `picks`, `education`, `sellers` are *prose the reporter authors*. The methodology section is the structured `method`; the process section up top is its brief human-readable narration.
- **Spine vs `attrs`** — the spine is the fields every product has; `attrs` holds the category-specific ones. A `Facet.id` resolves against the spine first, then `attrs`, so `price` is both a table column and a filterable/chartable axis with no special-casing.
- **Derived** — `landed = price + shipping`; duty is shown beside it, never folded in.
- **Flags** — the hunter's editorial annotations on a row (★ best, ⚠ caution): structured data lives in facets, judgment lives in flags.
- **Conditional sections** — `ladder?` and any empty array simply don't render.

## Open questions

- **Generation** — how data + prose become the report HTML: a thin CLI (`data.json` in, HTML out) vs the skill filling a template directly. The output markup must be tight and editor-friendly (the report is hand-augmented after generation — see the `deal-reporter` skill).
- **Self-contained vs hosted** — one fully-inlined file per report, or a shared/versioned viewer the report points at.
- **Live-derived axes** — let the UI compute `price ÷ any numeric facet` (e.g. $/MB-cache) on demand, instead of the hunter pre-baking each ratio as a facet.
- **The scaffold** (`src/`, `tokens.css` / `components.css`) — keep as a style reference or bin it. Currently untracked, undecided.
- **deal-hunter ↔ report handoff** — deal-hunter currently ends at a ranked chat table ("report deferred"); when and how report generation fires is unsettled.
