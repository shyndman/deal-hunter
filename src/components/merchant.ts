/* Seller / merchant card — Frame F4. Venue chip, optional badge, seller handle,
   feedback bar, and location line. */

import type { Merchant } from "../types.js";
import { esc, venueTone } from "./style.js";

const badgeStyle = (kind: "good" | "warn" | "neutral"): string =>
  kind === "good"
    ? "background:#e6f1ea;color:#1f7a52;"
    : kind === "warn"
      ? "background:#f7eddb;color:#a9740f;"
      : "background:#f3efe7;color:#8a7a5a;";

export const merchantCard = (m: Merchant): string => {
  const t = venueTone(m.venue);
  const pct = parseFloat(m.positivePct);
  const barColor = pct >= 99.5 ? "var(--good)" : "#7a8a6a";
  const badge = m.badge
    ? `<span class="dh-merchant__badge" style="${badgeStyle(m.badge.kind)}">${esc(m.badge.label)}</span>`
    : "";
  return `<div class="dh-card dh-merchant">
    <div class="dh-merchant__head">
      <span class="dh-chip" style="font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:-0.01em;padding:3px 8px;border-radius:5px;color:${t};background:${t}14;border:1px solid ${t}2e;">${esc(m.venue)}</span>
      ${badge}
    </div>
    <div class="dh-merchant__seller">${esc(m.seller)}</div>
    <div>
      <div class="dh-merchant__stats">
        <span><strong>${esc(m.positivePct)}</strong> positive</span>
        <span class="dh-merchant__vol">${esc(m.ratingVolume)} ratings</span>
      </div>
      <div class="dh-merchant__bar-bg"><div class="dh-merchant__bar" style="width:${pct}%;background:${barColor};"></div></div>
    </div>
    <div class="dh-merchant__loc">
      <span class="dh-merchant__flag">${esc(m.locationFlag)}</span><span>${esc(m.locationNote)}</span>
    </div>
  </div>`;
};

export const merchantGrid = (merchants: Merchant[]): string =>
  `<div class="dh-merchant-grid">${merchants.map(merchantCard).join("")}</div>`;
