import { createSignal, createMemo, For } from "solid-js";
import { dataset } from "./fixture";
import { Engine } from "./engine";
import type { Selection } from "./engine";
import type { Item } from "./contract";
import Band from "./Band";
import Chart from "./Chart";
import Table from "./Table";

export default function App() {
  const engine = new Engine(dataset.items, dataset.facets);
  const [version, setVersion] = createSignal(0);
  const [hoveredId, setHoveredId] = createSignal<string | null>(null);
  const [selectedId, setSelectedId] = createSignal<string | null>(null);

  const numericFacets = dataset.facets.filter((f) => f.type === "numeric");
  const [axisX, setAxisX] = createSignal(dataset.chart.x);
  const [axisY, setAxisY] = createSignal(dataset.chart.y);

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

  return (
    <>
      <Band engine={engine} version={version} onChange={setFilter} />
      <div id="axes">
        <label>
          X{" "}
          <select value={axisX()} onChange={(e) => setAxisX(e.currentTarget.value)}>
            <For each={numericFacets.filter((f) => f.id !== axisY())}>
              {(f) => <option value={f.id}>{f.label}</option>}
            </For>
          </select>
        </label>{" "}
        <button onClick={() => { const x = axisX(); setAxisX(axisY()); setAxisY(x); }}>⇄</button>{" "}
        <label>
          Y{" "}
          <select value={axisY()} onChange={(e) => setAxisY(e.currentTarget.value)}>
            <For each={numericFacets.filter((f) => f.id !== axisX())}>
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
        onHover={setHoveredId}
        onSelect={onSelect}
      />
      <Table
        facets={dataset.facets}
        axisX={axisX}
        axisY={axisY}
        rows={filtered}
        hoveredId={hoveredId}
        selectedId={selectedId}
        onHover={setHoveredId}
        onSelect={onSelect}
      />
    </>
  );
}
