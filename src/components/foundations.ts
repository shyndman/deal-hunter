/* Foundations card — Frame F1. Palette swatches + the two type registers. */

import { esc } from "./style.js";

interface Swatch {
  name: string;
  hex: string;
}

const PALETTE: Swatch[] = [
  { name: "Paper", hex: "#f4f1ea" },
  { name: "Panel", hex: "#fffdf8" },
  { name: "Ink", hex: "#23201b" },
  { name: "Ink-2", hex: "#6f6658" },
  { name: "Accent", hex: "#2a6fdb" },
  { name: "Good", hex: "#1f7a52" },
  { name: "Warn", hex: "#a9740f" },
  { name: "Hairline", hex: "#e4ded1" },
];

const swatch = (c: Swatch): string =>
  `<div>
    <div class="dh-swatch__chip" style="background:${c.hex};"></div>
    <div class="dh-swatch__name">${esc(c.name)}</div>
    <div class="dh-swatch__hex">${esc(c.hex)}</div>
  </div>`;

export const foundations = (): string =>
  `<div class="dh-card dh-foundations">
    <div class="dh-foundations__label">Palette</div>
    <div class="dh-swatches">${PALETTE.map(swatch).join("")}</div>
    <div class="dh-foundations__label dh-foundations__label--type">Type — two registers</div>
    <div class="dh-type-serif-lg">Newsreader — the document voice</div>
    <div class="dh-type-serif">Prose, verdicts, education. Serif at a comfortable reading measure with real whitespace.</div>
    <div class="dh-type-sans">IBM&nbsp;Plex&nbsp;Sans — the tool voice · labels, chips, controls</div>
    <div class="dh-type-mono">IBM Plex Mono — numerics · C$475 · $30/TB · 18.9K · 100%</div>
  </div>`;
