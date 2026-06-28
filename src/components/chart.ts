/* Price vs $/TB scatter — Frames F7 (unfiltered) and F8 (filtered/dimmed).
   Renders SVG directly. The "dim, don't remove" behavior is the whole point:
   non-matching points stay on the canvas at low opacity (ECharts
   visualMap.outOfRange.opacity does this in the live build; here it's literal). */

import type { Listing } from "../types.js";
import { esc } from "./style.js";

// Plot box + data domain — matches the doc's axes.
const PX0 = 64, PX1 = 576, PY0 = 40, PY1 = 350;
const L_MIN = 180, L_MAX = 800; // landed CAD
const T_MIN = 25, T_MAX = 65; // $/TB

const SAS = "var(--accent)";
const SATA = "#a59c8b";

const fx = (landed: number) =>
  +(PX0 + ((landed - L_MIN) / (L_MAX - L_MIN)) * (PX1 - PX0)).toFixed(1);
const fy = (ppt: number) =>
  +(PY1 - ((ppt - T_MIN) / (T_MAX - T_MIN)) * (PY1 - PY0)).toFixed(1);
const fill = (r: Listing) => (r.iface === "SAS" ? SAS : SATA);
const radius = (r: Listing) => (r.capacityTB === 16 ? 7.5 : r.capacityTB === 12 ? 6 : 5);

const GRID = `
  <g stroke="#ece7db" stroke-width="1">
    <line x1="64" y1="40" x2="64" y2="350"></line>
    <line x1="192" y1="40" x2="192" y2="350"></line>
    <line x1="320" y1="40" x2="320" y2="350"></line>
    <line x1="448" y1="40" x2="448" y2="350"></line>
    <line x1="576" y1="40" x2="576" y2="350"></line>
    <line x1="64" y1="40" x2="576" y2="40"></line>
    <line x1="64" y1="118" x2="576" y2="118"></line>
    <line x1="64" y1="195" x2="576" y2="195"></line>
    <line x1="64" y1="273" x2="576" y2="273"></line>
  </g>
  <line x1="64" y1="350" x2="576" y2="350" stroke="#bdb4a3" stroke-width="1.5"></line>
  <g fill="#9a9182" font-size="11" text-anchor="end">
    <text x="56" y="44">$65</text><text x="56" y="122">$55</text><text x="56" y="199">$45</text><text x="56" y="277">$35</text><text x="56" y="354">$25</text>
  </g>
  <g fill="#9a9182" font-size="11" text-anchor="middle">
    <text x="64" y="368">C$180</text><text x="192" y="368">C$340</text><text x="320" y="368">C$490</text><text x="448" y="368">C$650</text><text x="576" y="368">C$800</text>
  </g>
  <text x="320" y="394" fill="#6f6658" font-size="11.5" text-anchor="middle" font-weight="600" letter-spacing="0.04em">LANDED PRICE (CAD)  →</text>
  <text x="20" y="195" fill="#6f6658" font-size="11.5" text-anchor="middle" font-weight="600" letter-spacing="0.04em" transform="rotate(-90 20 195)">$ / TB  →</text>`;

const dot = (r: Listing, opts: { dim?: boolean } = {}): string => {
  const base = `cx="${fx(r.landedPrice)}" cy="${fy(r.pricePerTB)}" r="${radius(r)}" fill="${fill(r)}"`;
  return opts.dim
    ? `<circle ${base} opacity="0.16"></circle>`
    : `<circle ${base} stroke="#fffdf8" stroke-width="1.5"></circle>`;
};

const svg = (inner: string): string =>
  `<svg viewBox="0 0 600 410" class="dh-chart__svg">${GRID}${inner}</svg>`;

const legend = `<div class="dh-chart__legend">
  <span class="dh-chart__key"><span class="dh-dot" style="background:${SAS};"></span>SAS</span>
  <span class="dh-chart__key"><span class="dh-dot" style="background:${SATA};"></span>SATA</span>
</div>`;

const frame = (title: string, right: string, body: string): string =>
  `<div class="dh-card dh-chart">
    <div class="dh-chart__head"><span class="dh-chart__title">${esc(title)}</span>${right}</div>
    <div class="dh-chart__body">${body}</div>
  </div>`;

/** Unfiltered — every listing solid. */
export const chartUnfiltered = (rows: Listing[]): string =>
  frame("Price vs $/TB", legend, svg(rows.map((r) => dot(r)).join("")));

/** Filtered — non-matches dimmed to 16%, matches drawn on top. */
export const chartFiltered = (
  rows: Listing[],
  match: (r: Listing) => boolean,
  caption: string,
): string => {
  const dim = rows.filter((r) => !match(r));
  const hit = rows.filter(match);
  const right = `<span class="dh-chart__caption">${esc(caption)}</span>`;
  const inner =
    dim.map((r) => dot(r, { dim: true })).join("") + hit.map((r) => dot(r)).join("");
  return frame("Price vs $/TB", right, svg(inner));
};
