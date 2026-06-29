export interface Flag {
  icon: string;
  kind: "good" | "warn";
  label?: string;
}

export interface Item {
  id: string; // first 5 chars of a url hash
  title: string;
  price: number; // item only, CAD
  shipping: number; // CAD (0 = free)
  duty?: number; // unused for GPUs (MFN duty-free); kept for contract parity
  venue: string;
  seller?: string;
  url: string;
  flags: Flag[];
  attrs: Record<string, string | number | boolean>;
}

export type FacetType = "numeric" | "categorical" | "boolean";

export interface Facet {
  id: string;
  label: string;
  type: FacetType;
  unit?: string;
}

export interface Dataset {
  items: Item[];
  facets: Facet[];
  chart: { x: string; y: string }; // facet ids
}
