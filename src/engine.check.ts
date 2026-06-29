import assert from "node:assert/strict";
import { dataset } from "./fixture";
import { Engine } from "./engine";
import { resolve } from "./resolve";

const e = new Engine(dataset.items, dataset.facets);
assert.ok(dataset.items.length > 30, "fixture has rows");
assert.equal(e.filtered().length, dataset.items.length, "no filter => all");

const amd = dataset.items.filter((i) => i.attrs.vendor === "AMD").length;
e.setFilter("vendor", { kind: "categorical", values: ["AMD"] });
assert.equal(e.filtered().length, amd, "vendor=AMD count matches");
assert.ok(
  e.filtered().every((i) => i.attrs.vendor === "AMD"),
  "all rows AMD",
);
assert.ok(e.counts("model").size > 0, "model counts present under AMD filter");
e.setFilter("vendor", null);
assert.equal(e.filtered().length, dataset.items.length, "cleared => all");

const has48 = dataset.items.filter((i) => Number(i.attrs.vramGB) === 48).length;
e.setFilter("vramGB", { kind: "numeric", min: 48, max: 48 });
assert.equal(e.filtered().length, has48, "vramGB=48 count");
assert.ok(
  e.filtered().every((i) => Number(i.attrs.vramGB) === 48),
  "all 48GB",
);
e.setFilter("vramGB", null);

assert.equal(
  resolve(dataset.items[0], "price"),
  dataset.items[0].price,
  "spine resolves",
);
assert.equal(typeof resolve(dataset.items[0], "tops"), "number", "attr resolves");
console.log(`engine.check OK — ${dataset.items.length} items`);
