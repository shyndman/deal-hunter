import { onMount, onCleanup, createEffect, untrack } from "solid-js";
import type { Accessor } from "solid-js";
import * as echarts from "echarts";
import type { Item, Facet } from "./contract";
import { resolve } from "./resolve";

interface Props {
  items: Item[];
  facets: Facet[];
  axisX: Accessor<string>;
  axisY: Accessor<string>;
  matchedIds: Accessor<Set<string>>;
  hoveredId: Accessor<string | null>;
  selectedId: Accessor<string | null>;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export default function Chart(props: Props) {
  let el!: HTMLDivElement;

  onMount(() => {
    const { items, facets } = props;
    const ids = items.map((i) => i.id);
    const indexById = new Map(ids.map((id, i) => [id, i]));
    const axisName = (f: Facet): string => (f.unit ? `${f.label} (${f.unit})` : f.label);
    const num = (it: Item, id: string): number => {
      const v = resolve(it, id);
      return typeof v === "number" ? v : NaN;
    };
    const data = (matched: Set<string>): echarts.ScatterSeriesOption["data"] =>
      items.map((it) => ({
        name: it.id,
        title: it.title,
        value: [num(it, props.axisX()), num(it, props.axisY()), matched.has(it.id) ? 1 : 0],
      }));

    const c = echarts.init(el);
    c.setOption({
      xAxis: { type: "value", scale: true },
      yAxis: { type: "value", scale: true },
      tooltip: {
        trigger: "item",
        formatter: (p: { data: { title: string }; value: number[] }) => {
          const xf = facets.find((f) => f.id === props.axisX())!;
          const yf = facets.find((f) => f.id === props.axisY())!;
          return `${p.data.title}<br>${xf.label}: ${p.value[0]}<br>${yf.label}: ${p.value[1]}`;
        },
      },
      visualMap: {
        show: false,
        type: "piecewise",
        dimension: 2,
        pieces: [{ value: 1 }],
        inRange: { opacity: 1 },
        outOfRange: { opacity: 0.16 },
      },
      series: [
        {
          type: "scatter",
          symbolSize: 10,
          selectedMode: "single",
          select: { itemStyle: { borderColor: "#000", borderWidth: 3 } },
          emphasis: { scale: 1.8, itemStyle: { color: "#fab005", borderColor: "#000", borderWidth: 2 } },
          data: data(props.matchedIds()),
        },
      ],
    });

    type EChartsParams = { componentType?: string; dataIndex: number };
    c.on("mouseover", (p) => {
      const ep = p as EChartsParams;
      if (ep.componentType === "series") props.onHover(ids[ep.dataIndex]);
    });
    c.on("mouseout", () => props.onHover(null));
    c.on("click", (p) => {
      const ep = p as EChartsParams;
      if (ep.componentType === "series") props.onSelect(ids[ep.dataIndex]);
    });

    const applyHover = (id: string | null): void => {
      c.dispatchAction({ type: "downplay", seriesIndex: 0 });
      if (id !== null) {
        const i = indexById.get(id);
        if (i !== undefined) c.dispatchAction({ type: "highlight", seriesIndex: 0, dataIndex: i });
      }
    };
    let selIdx: number | null = null;
    const applySelected = (id: string | null): void => {
      if (selIdx !== null) c.dispatchAction({ type: "unselect", seriesIndex: 0, dataIndex: selIdx });
      selIdx = null;
      if (id !== null) {
        const i = indexById.get(id);
        if (i !== undefined) {
          c.dispatchAction({ type: "select", seriesIndex: 0, dataIndex: i });
          selIdx = i;
        }
      }
    };

    // Re-plot on axis or filter change, then re-apply current hover/selection untracked so this
    // effect depends only on axes + matchedIds.
    createEffect(() => {
      const xf = facets.find((f) => f.id === props.axisX())!;
      const yf = facets.find((f) => f.id === props.axisY())!;
      c.setOption({
        xAxis: { name: axisName(xf) },
        yAxis: { name: axisName(yf) },
        series: [{ data: data(props.matchedIds()) }],
      });
      applyHover(untrack(props.hoveredId));
      selIdx = null;
      applySelected(untrack(props.selectedId));
    });
    createEffect(() => applyHover(props.hoveredId()));
    createEffect(() => applySelected(props.selectedId()));

    const onResize = (): void => c.resize();
    window.addEventListener("resize", onResize);
    onCleanup(() => {
      window.removeEventListener("resize", onResize);
      c.dispose();
    });
  });

  return <div ref={el} style={{ width: "100%", height: "420px" }} />;
}
