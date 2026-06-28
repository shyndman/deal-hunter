/* Showcase — reproduces the Components.dc.html canvas from the real components,
   for visual QA. Not part of the shipped viewer bundle. */

import {
  foundations,
  flagLegend,
  venueChip,
  conditionBadge,
  ladderTable,
  merchantGrid,
  listingsTable,
  listingsTableEmpty,
  chartUnfiltered,
  chartFiltered,
} from "./index.js";
import type { ConditionTier, Listing } from "./types.js";
import { listings, ladder, merchants } from "./data/sample.js";

const frame = (label: string, body: string, variant = ""): string =>
  `<section class="frame">
    <div class="dh-frame__label ${variant}">${label}</div>
    ${body}
  </section>`;

// F2 — chip / badge / flag rows
const VENUES = ["eBay", "Amazon", "ServerPartDeals", "goHardDrive", "Newegg", "CanadaComp"];
const TIERS: ConditionTier[] = ["Used pull", "Refurb", "Renewed", "Open box", "New"];
const FLAG_DEFS = [
  { icon: "★", kind: "good" as const, label: "Best — domestic, no border" },
  { icon: "A", kind: "good" as const, label: "Grade A · <50k hrs" },
  { icon: "⚠", kind: "warn" as const, label: "Soft flag — health / stock" },
];

const badgesFrame = (): string =>
  `<div class="dh-card" style="padding:24px 26px;display:flex;flex-direction:column;gap:22px;">
    <div>
      <div class="dh-foundations__label">Marketplace · venue</div>
      <div class="row">${VENUES.map(venueChip).join("")}</div>
    </div>
    <div>
      <div class="dh-foundations__label">Condition tier</div>
      <div class="row">${TIERS.map((t) => conditionBadge(t)).join("")}</div>
    </div>
    <div>
      <div class="dh-foundations__label">Listing flags</div>
      <div class="row" style="gap:14px;">${flagLegend(FLAG_DEFS)}</div>
    </div>
  </div>`;

// F5 — top 12 by $/TB then landed
const top12: Listing[] = [...listings]
  .sort((a, b) => a.pricePerTB - b.pricePerTB || a.landedPrice - b.landedPrice)
  .slice(0, 12);

// F8 — filter: SAS, ≤ C$550, ≤ $45/TB
const match = (r: Listing) => r.iface === "SAS" && r.landedPrice <= 550 && r.pricePerTB <= 45;
const matchCount = listings.filter(match).length;

const app = document.getElementById("app")!;
app.innerHTML = `
  <div class="col">
    ${frame("Foundations · color &amp; type", foundations())}
    ${frame("Typed data · badges &amp; marketplace chips", badgesFrame())}
    ${frame("Typed data · $/TB ladder", ladderTable(ladder))}
  </div>
  <div class="col col--wide">
    ${frame("Typed data · seller / merchant card", merchantGrid(merchants))}
    ${frame("Table · sorted ($/TB ↑, then landed ↑) · drag &amp; resize columns", listingsTable(top12), "dh-frame__label--accent")}
    ${frame("Table · empty — filters matched nothing", listingsTableEmpty(), "dh-frame__label--muted")}
  </div>
  <div class="col">
    ${frame("Chart · unfiltered — every listing solid", chartUnfiltered(listings), "dh-frame__label--muted")}
    ${frame(
      "Chart · filtered — non-matches dim to 16% (kept, not removed)",
      chartFiltered(listings, match, `SAS · ≤ $45/TB · ≤ C$550 → ${matchCount} of ${listings.length}`),
      "dh-frame__label--accent",
    )}
  </div>
`;
