/* $/TB ladder — Frame F3. Cheapest acceptable per combo, ranked, with a
   proportional bar and threshold-colored $/TB. */

import type { LadderRung } from "../types.js";
import { esc } from "./style.js";

const PPT_MAX = 35; // bar scale ceiling, matches the doc

const rung = (L: LadderRung, last: boolean): string => {
  const tbColor = L.best ? "var(--good)" : "var(--ink)";
  const barColor = L.best ? "var(--good)" : "#bdb4a3";
  const width = Math.round((L.pricePerTB / PPT_MAX) * 100);
  const rowCls = `dh-ladder__row${L.best ? " is-best" : ""}${last ? " is-last" : ""}`;
  return `<div class="${rowCls}">
    <div class="dh-ladder__combo">${esc(L.combo)}</div>
    <div class="dh-ladder__track">
      <div class="dh-ladder__bar-bg"><div class="dh-ladder__bar" style="width:${width}%;background:${barColor};"></div></div>
      <span class="dh-ladder__landed">${esc(L.landed)}</span>
    </div>
    <div class="dh-ladder__ppt" style="color:${tbColor};">$${L.pricePerTB}</div>
    <div class="dh-ladder__cond">${esc(L.condition)}</div>
  </div>`;
};

export const ladderTable = (rungs: LadderRung[]): string =>
  `<div class="dh-card dh-ladder">${rungs
    .map((L, i) => rung(L, i === rungs.length - 1))
    .join("")}</div>`;
