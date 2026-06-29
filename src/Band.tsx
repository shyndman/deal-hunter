import { For, createMemo } from "solid-js";
import type { Accessor } from "solid-js";
import type { Engine, Selection } from "./engine";
import type { Facet } from "./contract";

interface BandProps {
  engine: Engine;
  version: Accessor<number>;
  onChange: (id: string, sel: Selection | null) => void;
}

function NumericFacet(props: { engine: Engine; facet: Facet; onChange: BandProps["onChange"] }) {
  const [lo, hi] = props.engine.extent(props.facet.id);
  let min = lo;
  let max = hi;
  const apply = (): void => props.onChange(props.facet.id, { kind: "numeric", min, max });
  return (
    <fieldset>
      <legend>{props.facet.unit ? `${props.facet.label} (${props.facet.unit})` : props.facet.label}</legend>
      min{" "}
      <input
        type="number"
        value={lo}
        min={lo}
        max={hi}
        onInput={(e) => {
          min = Number(e.currentTarget.value);
          apply();
        }}
      />{" "}
      max{" "}
      <input
        type="number"
        value={hi}
        min={lo}
        max={hi}
        onInput={(e) => {
          max = Number(e.currentTarget.value);
          apply();
        }}
      />
    </fieldset>
  );
}

function CategoricalFacet(props: {
  engine: Engine;
  facet: Facet;
  version: Accessor<number>;
  onChange: BandProps["onChange"];
}) {
  const values = props.engine.distinct(props.facet.id);
  const selected = new Set<string>();
  const counts = createMemo(() => {
    props.version();
    return props.engine.counts(props.facet.id);
  });
  return (
    <fieldset>
      <legend>{props.facet.unit ? `${props.facet.label} (${props.facet.unit})` : props.facet.label}</legend>
      <For each={values}>
        {(v) => (
          <>
            <label>
              <input
                type="checkbox"
                value={v}
                onChange={(e) => {
                  if (e.currentTarget.checked) selected.add(v);
                  else selected.delete(v);
                  props.onChange(
                    props.facet.id,
                    selected.size ? { kind: "categorical", values: [...selected] } : null,
                  );
                }}
              />{" "}
              {v} <span>({counts().get(v) ?? 0})</span>
            </label>
            <br />
          </>
        )}
      </For>
    </fieldset>
  );
}

export default function Band(props: BandProps) {
  return (
    <div id="band">
      <For each={props.engine.facets}>
        {(f) =>
          f.type === "numeric" ? (
            <NumericFacet engine={props.engine} facet={f} onChange={props.onChange} />
          ) : (
            <CategoricalFacet engine={props.engine} facet={f} version={props.version} onChange={props.onChange} />
          )
        }
      </For>
    </div>
  );
}
