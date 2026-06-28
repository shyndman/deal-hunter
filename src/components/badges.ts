/* Typed-data primitives — Frame F2. Venue chips, condition badges, flag boxes.
   Each returns an HTML string; compose them into rows, cards, and table cells. */

import type { ConditionTier, FlagKind, ListingFlag } from "../types.js";
import {
  conditionStyle,
  esc,
  flagBoxStyle,
  venueChipStyle,
  venueLabel,
} from "./style.js";

export const venueChip = (venue: string): string =>
  `<span class="dh-chip" style="${venueChipStyle(venue)}">${esc(venueLabel(venue))}</span>`;

export const conditionBadge = (tier: ConditionTier, label?: string): string =>
  `<span class="dh-badge" style="${conditionStyle(tier)}">${esc(label ?? tier)}</span>`;

export const flagBox = (icon: string, kind: FlagKind): string =>
  `<span class="dh-flag" style="${flagBoxStyle(kind)}">${esc(icon)}</span>`;

/** A row of flag boxes (table cell). */
export const flagBoxes = (flags: ListingFlag[]): string =>
  flags.map((f) => flagBox(f.icon, f.kind)).join("");

/** Flag legend — icon + descriptive label (Frame F2, "Listing flags"). */
export const flagLegend = (flags: ListingFlag[]): string =>
  flags
    .map(
      (f) =>
        `<span class="dh-flag-legend"><span class="dh-flag" style="${flagBoxStyle(f.kind)}">${esc(f.icon)}</span><span class="dh-flag-legend__label">${esc(f.label ?? "")}</span></span>`,
    )
    .join("");
