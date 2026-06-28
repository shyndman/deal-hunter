/* Library entry — the component surface the viewer bundle exposes.
   Maps 1:1 to the frames in Components.dc.html. */

import "./styles/tokens.css";
import "./styles/components.css";

export * from "./types.js";

// Foundations (F1)
export { foundations } from "./components/foundations.js";

// Typed-data primitives (F2)
export {
  venueChip,
  conditionBadge,
  flagBox,
  flagBoxes,
  flagLegend,
} from "./components/badges.js";

// $/TB ladder (F3)
export { ladderTable } from "./components/ladder.js";

// Merchant cards (F4)
export { merchantCard, merchantGrid } from "./components/merchant.js";

// Table (F5 active / F6 empty)
export { listingsTable, listingsTableEmpty } from "./components/table.js";
export type { SortMark } from "./components/table.js";

// Chart (F7 unfiltered / F8 filtered)
export { chartUnfiltered, chartFiltered } from "./components/chart.js";

// Style helpers (for custom composition)
export {
  venueTone,
  venueLabel,
  pricePerTBColor,
} from "./components/style.js";
