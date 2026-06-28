/* Listings table — Frames F5 (active, multi-sort) and F6 (empty / no-match).
   Presentational: takes already-sorted rows. The future crossfilter/Tabulator
   wiring (Facet Band doc) feeds it the matching set; the look stays this. */

import type { Listing } from "../types.js";
import { conditionBadge, flagBoxes, venueChip } from "./badges.js";
import { esc, pricePerTBColor } from "./style.js";

export interface SortMark {
  key: keyof Listing;
  dir: "asc" | "desc";
  rank: number; // 1-based multi-sort priority
}

const GRID = "48px 1.8fr 0.95fr 1fr 0.95fr 0.6fr";

const arrow = (dir: "asc" | "desc") => (dir === "asc" ? "▲" : "▼");

const headCell = (
  label: string,
  sort?: SortMark,
  opts: { lastSorted?: boolean } = {},
): string => {
  const active = !!sort;
  const badge = sort ? `<sup class="dh-th__rank">${sort.rank}</sup>` : "";
  const dir = sort ? ` <span class="dh-th__dir">${arrow(sort.dir)}</span>` : "";
  const cls = `dh-th${active ? " is-active" : ""}${opts.lastSorted ? " is-resize-edge" : ""}`;
  return `<div class="${cls}">${esc(label)}${dir}${badge}</div>`;
};

const row = (r: Listing, last: boolean): string =>
  `<div class="dh-tr${last ? " is-last" : ""}" style="grid-template-columns:${GRID};">
    <div class="dh-td dh-td--ppt" style="color:${pricePerTBColor(r.pricePerTB)};">$${r.pricePerTB}</div>
    <div class="dh-td dh-td--drive">
      <div class="dh-td__model">${esc(r.model)}</div>
      <div class="dh-td__iface">${esc(r.iface)} · ${r.capacityTB}TB · 7200</div>
    </div>
    <div class="dh-td dh-td--landed">C$${r.landedPrice}</div>
    <div class="dh-td">${conditionBadge(r.tier, r.condition)}</div>
    <div class="dh-td">${venueChip(r.venue)}</div>
    <div class="dh-td dh-td--flags">${flagBoxes(r.flags)}</div>
  </div>`;

const HEAD_LABELS = ["$/TB", "Drive", "Landed", "Condition", "Venue", "Flags"];

/** Active table. `sorts` keys map to the first columns ($/TB, Landed by default). */
export const listingsTable = (
  rows: Listing[],
  sorts: SortMark[] = [
    { key: "pricePerTB", dir: "asc", rank: 1 },
    { key: "landedPrice", dir: "asc", rank: 2 },
  ],
): string => {
  const byCol: Record<string, SortMark | undefined> = {
    "$/TB": sorts.find((s) => s.key === "pricePerTB"),
    Landed: sorts.find((s) => s.key === "landedPrice"),
  };
  const head = HEAD_LABELS.map((l) =>
    headCell(l, byCol[l], { lastSorted: l === "Venue" }),
  ).join("");
  const body = rows.map((r, i) => row(r, i === rows.length - 1)).join("");
  return `<div class="dh-card dh-table">
    <div class="dh-thead" style="grid-template-columns:${GRID};">${head}</div>
    ${body}
  </div>`;
};

/** Empty / no-match state. */
export const listingsTableEmpty = (): string => {
  const head = HEAD_LABELS.map((l) => `<div class="dh-th is-muted">${esc(l)}</div>`).join("");
  return `<div class="dh-card dh-table is-empty">
    <div class="dh-thead is-muted" style="grid-template-columns:${GRID};">${head}</div>
    <div class="dh-empty">
      <div class="dh-empty__title">No listings match these filters</div>
      <div class="dh-empty__body">Widen the price range or clear a chip — the chart still shows the full field, dimmed.</div>
      <button class="dh-empty__reset" type="button">Reset all filters</button>
    </div>
  </div>`;
};
