import { createSignal, createMemo, For } from "solid-js";
import { dataset } from "./fixture";
import { Engine } from "./engine";
import type { Selection } from "./engine";
import type { Item } from "./contract";
import Band from "./Band";
import Chart from "./Chart";
import Table from "./Table";

interface ChartAxes {
  readonly x: string;
  readonly y: string;
}

export default function App() {
  const engine = new Engine(dataset.items, dataset.facets);
  const [version, setVersion] = createSignal(0);
  const [hoveredId, setHoveredId] = createSignal<string | null>(null);
  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [scrollHoverId, setScrollHoverId] = createSignal<string | null>(null);

  const numericFacets = dataset.facets.filter((f) => f.type === "numeric");
  const [axes, setAxes] = createSignal<ChartAxes>({ x: dataset.chart.x, y: dataset.chart.y });
  const axisX = (): string => axes().x;
  const axisY = (): string => axes().y;
  const setAxisX = (x: string): void => {
    const a = axes();
    if (x !== a.y) setAxes({ x, y: a.y });
  };
  const setAxisY = (y: string): void => {
    const a = axes();
    if (y !== a.x) setAxes({ x: a.x, y });
  };
  const axisXOptions = createMemo(() => numericFacets.filter((f) => f.id !== axisY()));
  const axisYOptions = createMemo(() => numericFacets.filter((f) => f.id !== axisX()));

  const filtered = createMemo<Item[]>(() => {
    version();
    return engine.filtered();
  });
  const matchedIds = createMemo(() => new Set(filtered().map((i) => i.id)));

  const setFilter = (id: string, sel: Selection | null): void => {
    engine.setFilter(id, sel);
    setVersion((v) => v + 1);
  };
  const onSelect = (id: string): void => {
    setSelectedId((prev) => (prev === id ? null : id));
  };
  const onChartHover = (id: string | null): void => {
    setHoveredId(id);
    setScrollHoverId(id);
  };
  const onTableHover = (id: string | null): void => {
    setHoveredId(id);
    setScrollHoverId(null);
  };
  const swapAxes = (): void => {
    const a = axes();
    setAxes({ x: a.y, y: a.x });
  };

  return (
    <>
      <Band engine={engine} version={version} onChange={setFilter} />
      <div id="axes">
        <label>
          X{" "}
          <select value={axisX()} onChange={(e) => setAxisX(e.currentTarget.value)}>
            <For each={axisXOptions()}>
              {(f) => <option value={f.id}>{f.label}</option>}
            </For>
          </select>
        </label>{" "}
        <button type="button" onClick={swapAxes} aria-label="Swap axes">
          ⇄
        </button>{" "}
        <label>
          Y{" "}
          <select value={axisY()} onChange={(e) => setAxisY(e.currentTarget.value)}>
            <For each={axisYOptions()}>
              {(f) => <option value={f.id}>{f.label}</option>}
            </For>
          </select>
        </label>
      </div>
      <Chart
        items={dataset.items}
        facets={dataset.facets}
        axisX={axisX}
        axisY={axisY}
        matchedIds={matchedIds}
        hoveredId={hoveredId}
        selectedId={selectedId}
        onHover={onChartHover}
        onSelect={onSelect}
      />
      <Table
        facets={dataset.facets}
        axisX={axisX}
        axisY={axisY}
        rows={filtered}
        hoveredId={hoveredId}
        selectedId={selectedId}
        onHover={onTableHover}
        scrollHoverId={scrollHoverId}
        onSelect={onSelect}
      />
    </>
  );
}
