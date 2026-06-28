/* Dynamic style helpers — the per-datum color logic from Components.dc.html's
   renderVals(). Structural styling lives in components.css; this is only the
   stuff that depends on the value (venue tone, $/TB threshold color, flag tone). */

import type { ConditionTier, FlagKind } from "../types.js";

/** Per-venue brand tone. Unknown venues fall back to ink2. */
const VENUE_TONES: Record<string, string> = {
  eBay: "#0064d2",
  Amazon: "#c45500",
  ServerPartDeals: "#1f7a52",
  goHardDrive: "#6f6658",
  Newegg: "#c9252f",
  CanadaComp: "#4a5366",
};

export const venueTone = (venue: string): string => VENUE_TONES[venue] ?? "#6f6658";

export const venueLabel = (venue: string): string =>
  venue === "CanadaComp" ? "Canada Comp." : venue;

/** Venue chip — colored by brand tone (Frame F2 / F4 / F5). */
export const venueChipStyle = (venue: string): string => {
  const t = venueTone(venue);
  return `font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:-0.01em;padding:3px 9px;border-radius:5px;border:1px solid ${t}33;color:${t};background:${t}0d;`;
};

/** Condition badge palette (Frame F2). */
const COND_MAP: Record<ConditionTier, string> = {
  "Used pull": "background:#eef3ef;color:#3c6b4f;border:1px solid #d6e3d8",
  Refurb: "background:#f1eee7;color:#6f6658;border:1px solid #e0d9cb",
  Renewed: "background:#eef0f4;color:#4a5366;border:1px solid #dbe0e9",
  "Open box": "background:#f4efe6;color:#8a6a2a;border:1px solid #e7dcc5",
  New: "background:#e9f0fc;color:#2a5db0;border:1px solid #cfe0fa",
};

export const conditionStyle = (tier: ConditionTier): string =>
  `display:inline-block;font-family:var(--sans);font-size:11.5px;font-weight:500;padding:3px 9px;border-radius:5px;white-space:nowrap;${COND_MAP[tier]}`;

/** Flag box — small square icon (Frame F2 / F5). */
export const flagBoxStyle = (kind: FlagKind): string =>
  kind === "good"
    ? "display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;border-radius:4px;font-family:var(--mono);font-size:10px;font-weight:700;background:#e6f1ea;color:#1f7a52;border:1px solid #c5ddca;"
    : "display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;border-radius:4px;font-size:10px;background:#f7eddb;color:#a9740f;border:1px solid #ecdcbb;";

/** $/TB threshold color: green ≤28, amber ≥50, ink otherwise (Frame F3 / F5). */
export const pricePerTBColor = (ppt: number): string =>
  ppt <= 28 ? "var(--good)" : ppt >= 50 ? "var(--warn)" : "var(--ink)";

export const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
