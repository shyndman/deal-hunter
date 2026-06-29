import crossfilter from "crossfilter2";
import type { Crossfilter, Dimension } from "crossfilter2";
import type { Item, Facet } from "./contract";
import { resolve } from "./resolve";

export type Selection =
  | { kind: "categorical"; values: string[] }
  | { kind: "numeric"; min: number; max: number };

type CfValue = string | number;
type ItemDimension = Dimension<Item, CfValue>;

export class Engine {
  private cf: Crossfilter<Item>;
  private dims = new Map<string, ItemDimension>();

  constructor(
    public items: Item[],
    public facets: Facet[],
  ) {
    this.cf = crossfilter(items);
    for (const f of facets) {
      const dim =
        f.type === "numeric"
          ? this.cf.dimension<CfValue>((d) => Number(resolve(d, f.id)))
          : this.cf.dimension<CfValue>((d) => String(resolve(d, f.id)));
      this.dims.set(f.id, dim);
    }
  }

  setFilter(id: string, sel: Selection | null): void {
    const dim = this.dims.get(id)!;
    if (!sel) {
      dim.filterAll();
      return;
    }
    if (sel.kind === "categorical") {
      if (sel.values.length === 0) dim.filterAll();
      else dim.filterFunction((k) => sel.values.includes(k as string));
    } else {
      dim.filterFunction(
        (v) => (v as number) >= sel.min && (v as number) <= sel.max,
      );
    }
  }

  filtered(): Item[] {
    return this.cf.allFiltered();
  }

  counts(id: string): Map<string, number> {
    const m = new Map<string, number>();
    for (const g of this.dims.get(id)!.group().all())
      m.set(String(g.key), Number(g.value));
    return m;
  }

  extent(id: string): [number, number] {
    let lo = Infinity,
      hi = -Infinity;
    for (const it of this.items) {
      const v = resolve(it, id);
      if (typeof v === "number") {
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
    return [lo, hi];
  }

  distinct(id: string): string[] {
    const s = new Set<string>();
    for (const it of this.items) {
      const v = resolve(it, id);
      if (v !== undefined) s.add(String(v));
    }
    return [...s].sort();
  }
}
