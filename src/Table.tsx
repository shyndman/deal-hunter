import { onMount, onCleanup, createEffect } from "solid-js";
import type { Accessor } from "solid-js";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import type { ColumnDefinition, RowComponent, CellComponent } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import type { Item, Facet } from "./contract";
import { resolve } from "./resolve";

interface Props {
  facets: Facet[];
  axisX: Accessor<string>;
  axisY: Accessor<string>;
  rows: Accessor<Item[]>;
  hoveredId: Accessor<string | null>;
  selectedId: Accessor<string | null>;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export default function Table(props: Props) {
  let el!: HTMLDivElement;

  onMount(() => {
    const facets = props.facets;
    const unitOrLabel = (f: Facet): string => f.unit ?? f.label;
    const ratioTitle = (): string => {
      const xf = facets.find((f) => f.id === props.axisX())!;
      const yf = facets.find((f) => f.id === props.axisY())!;
      return `${unitOrLabel(yf)}/${unitOrLabel(xf)}`;
    };
    const rowOf = (it: Item): Record<string, unknown> => {
      const r: Record<string, unknown> = {
        title: it.title,
        id: it.id,
        venue: it.venue,
        price: it.price,
        shipping: it.shipping,
        url: it.url,
      };
      for (const f of facets) r[`f_${f.id}`] = resolve(it, f.id);
      const xv = resolve(it, props.axisX());
      const yv = resolve(it, props.axisY());
      r.ratio = typeof xv === "number" && typeof yv === "number" && xv !== 0 ? yv / xv : undefined;
      return r;
    };

    const columns: ColumnDefinition[] = [
      { title: "Title", field: "title" },
      { title: "Venue", field: "venue" },
      { title: "Price", field: "price", sorter: "number" },
      { title: "Ship", field: "shipping", sorter: "number" },
      ...facets.map(
        (f): ColumnDefinition => ({
          title: f.label,
          field: `f_${f.id}`,
          sorter: f.type === "numeric" ? "number" : "string",
        }),
      ),
      {
        title: ratioTitle(),
        field: "ratio",
        sorter: "number",
        formatter: (cell: CellComponent) => {
          const v = cell.getValue();
          return typeof v === "number" ? v.toFixed(2) : "";
        },
      },
      { title: "URL", field: "url", formatter: "link", formatterParams: { label: "open", target: "_blank" } },
    ];

    let built = false;
    let pending: Item[] | null = null;
    let curHover: string | null = null;
    let curSelected: string | null = null;

    const setHover = (id: string | null): void => {
      const prev = curHover;
      if (prev !== null) {
        try {
          table.getRow(prev)?.getElement().classList.remove("deal-hover");
        } catch {
          /* row absent */
        }
      }
      curHover = id;
      if (id !== null) {
        try {
          table.getRow(id)?.getElement().classList.add("deal-hover");
        } catch {
          /* row absent */
        }
      }
    };
    const setSelected = (id: string | null): void => {
      curSelected = id;
      table.deselectRow();
      if (id !== null) {
        try {
          if (table.getRow(id)) table.selectRow(id);
        } catch {
          /* row absent */
        }
      }
    };
    const reapply = (): void => {
      const h = curHover;
      curHover = null;
      setHover(h);
      setSelected(curSelected);
    };

    const table = new Tabulator(el, {
      data: [],
      columns,
      index: "id",
      selectableRows: 1,
      layout: "fitDataTable",
      height: "420px",
      movableColumns: true,
    });
    table.on("rowMouseEnter", (_e: UIEvent, row: RowComponent) =>
      props.onHover(row.getData().id as string),
    );
    table.on("rowMouseLeave", () => props.onHover(null));
    table.on("rowClick", (_e: UIEvent, row: RowComponent) =>
      props.onSelect(row.getData().id as string),
    );
    table.on("tableBuilt", () => {
      built = true;
      if (pending) {
        void table.replaceData(pending.map(rowOf)).then(reapply);
        pending = null;
      }
    });

    createEffect(() => {
      const rows = props.rows();
      props.axisX();
      props.axisY();
      if (built) {
        table.getColumn("ratio")?.updateDefinition({ title: ratioTitle() });
        void table.replaceData(rows.map(rowOf)).then(reapply);
      } else pending = rows;
    });
    createEffect(() => setHover(props.hoveredId()));
    createEffect(() => setSelected(props.selectedId()));

    onCleanup(() => table.destroy());
  });

  return <div id="table" ref={el} />;
}
