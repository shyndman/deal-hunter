/* Data contract for the viewer.
   The README spine is universal; the fields below are the HDD-hunt shape that
   Components.dc.html renders. Category-specific keys stay free-form on `extra`. */

export type Interface = "SAS" | "SATA";

/** Condition tiers — the badge vocabulary from Frame F2. */
export type ConditionTier =
  | "Used pull"
  | "Refurb"
  | "Renewed"
  | "Open box"
  | "New";

export type FlagKind = "good" | "warn";

export interface ListingFlag {
  icon: string; // ★ A ⚠
  kind: FlagKind;
  label?: string;
}

/** One ranked listing — a row in the table and a point in the chart. */
export interface Listing {
  /** Universal spine. */
  landedPrice: number; // CAD, landed (item + ship) × FX × HST
  currency: string; // "CAD"
  venue: string; // eBay, Amazon, ServerPartDeals, goHardDrive, Newegg, CanadaComp
  seller?: string;
  url?: string;
  flags: ListingFlag[];

  /** HDD-specific, but typed because the whole hunt is one category. */
  capacityTB: number; // 8 | 12 | 16
  iface: Interface;
  model: string;
  condition: string; // free-form label, e.g. "Cert-Refurb"
  tier: ConditionTier; // normalized tier driving the badge
  pricePerTB: number; // $/TB, landed CAD

  extra?: Record<string, unknown>;
}

/** Seller / merchant card (Frame F4). */
export interface Merchant {
  venue: string;
  seller: string;
  positivePct: string; // "100%"
  ratingVolume: string; // "792", "4.8K"
  locationFlag: string; // 🇨🇦 🇺🇸
  locationNote: string;
  badge?: { label: string; kind: FlagKind | "neutral" };
}

/** One rung of the $/TB ladder (Frame F3) — cheapest acceptable per combo. */
export interface LadderRung {
  combo: string; // "16TB SAS"
  landed: string; // "C$475"
  pricePerTB: number; // 30
  condition: string; // "used · Vancouver"
  best: boolean;
}

/** Facet declaration — drives the (future) facet band; category-agnostic. */
export interface Facet {
  id: string;
  label: string;
  type: "numeric" | "categorical" | "range" | "boolean";
  unit?: string;
}
