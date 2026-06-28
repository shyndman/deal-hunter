/* Sample dataset — the 22 listings embedded in Components.dc.html, used to drive
   the showcase and as a fixture. Real reports inline their own JSON via the
   #report-data <script> block (see README). */

import type { Listing, LadderRung, Merchant } from "../types.js";

const f = (icon: string, kind: "good" | "warn", label?: string) =>
  ({ icon, kind, label });

export const listings: Listing[] = [
  { capacityTB: 8, iface: "SAS", model: "Exos 7E8 ST8000NM0095", condition: "Used pull", tier: "Used pull", venue: "eBay", landedPrice: 200, pricePerTB: 25, currency: "CAD", flags: [] },
  { capacityTB: 8, iface: "SAS", model: "Exos 7E8 ST8000NM0185", condition: "Cert-Refurb", tier: "Refurb", venue: "goHardDrive", landedPrice: 335, pricePerTB: 42, currency: "CAD", flags: [] },
  { capacityTB: 8, iface: "SAS", model: "Exos 7E8 ST8000NM0075", condition: "Renewed", tier: "Renewed", venue: "Amazon", landedPrice: 362, pricePerTB: 45, currency: "CAD", flags: [] },
  { capacityTB: 8, iface: "SAS", model: "WD Ultrastar HC320", condition: "Seller-Refurb", tier: "Refurb", venue: "ServerPartDeals", landedPrice: 370, pricePerTB: 46, currency: "CAD", flags: [] },
  { capacityTB: 8, iface: "SATA", model: "Exos 7E8 ST8000NM0055", condition: "Used pull", tier: "Used pull", venue: "eBay", landedPrice: 246, pricePerTB: 31, currency: "CAD", flags: [] },
  { capacityTB: 8, iface: "SATA", model: "WD Gold WD8002FRYZ", condition: "Refurb", tier: "Refurb", venue: "goHardDrive", landedPrice: 367, pricePerTB: 46, currency: "CAD", flags: [] },
  { capacityTB: 8, iface: "SATA", model: "IronWolf Pro ST8000NT001", condition: "New", tier: "New", venue: "Newegg", landedPrice: 514, pricePerTB: 64, currency: "CAD", flags: [] },
  { capacityTB: 8, iface: "SATA", model: "IronWolf Pro ST8000NT001", condition: "New", tier: "New", venue: "CanadaComp", landedPrice: 554, pricePerTB: 69, currency: "CAD", flags: [] },
  { capacityTB: 12, iface: "SAS", model: "HP P04385 (HC520 OEM)", condition: "Used", tier: "Used pull", venue: "eBay", landedPrice: 302, pricePerTB: 25, currency: "CAD", flags: [f("⚠", "warn", "93.5% health")] },
  { capacityTB: 12, iface: "SAS", model: "Dell EMC H5H72121", condition: "Used", tier: "Used pull", venue: "eBay", landedPrice: 337, pricePerTB: 28, currency: "CAD", flags: [f("A", "good", "Grade A · <50k hrs")] },
  { capacityTB: 12, iface: "SAS", model: "WD He12 (4Kn)", condition: "Seller-Refurb", tier: "Refurb", venue: "ServerPartDeals", landedPrice: 538, pricePerTB: 45, currency: "CAD", flags: [] },
  { capacityTB: 12, iface: "SAS", model: "Exos X16 ST12000NM002G", condition: "Open Box", tier: "Open box", venue: "ServerPartDeals", landedPrice: 587, pricePerTB: 49, currency: "CAD", flags: [] },
  { capacityTB: 12, iface: "SATA", model: "Exos X16 ST12000NM001G", condition: "Used pull", tier: "Used pull", venue: "eBay", landedPrice: 419, pricePerTB: 35, currency: "CAD", flags: [] },
  { capacityTB: 12, iface: "SATA", model: "Exos X12 ST12000NM0127", condition: "Renewed", tier: "Renewed", venue: "Amazon", landedPrice: 511, pricePerTB: 43, currency: "CAD", flags: [] },
  { capacityTB: 12, iface: "SATA", model: "Exos X14 ST12000NM0008", condition: "Cert-Refurb", tier: "Refurb", venue: "goHardDrive", landedPrice: 512, pricePerTB: 43, currency: "CAD", flags: [] },
  { capacityTB: 16, iface: "SAS", model: "Exos X16 ST16000NM002G", condition: "Used pull", tier: "Used pull", venue: "eBay", landedPrice: 475, pricePerTB: 30, currency: "CAD", flags: [f("★", "good", "Best — domestic, no border")] },
  { capacityTB: 16, iface: "SAS", model: "MDD white-label", condition: "Renewed", tier: "Renewed", venue: "goHardDrive", landedPrice: 528, pricePerTB: 33, currency: "CAD", flags: [f("⚠", "warn", "not named-brand")] },
  { capacityTB: 16, iface: "SAS", model: "Toshiba MG08 MG08SCA16TE", condition: "Seller-Refurb", tier: "Refurb", venue: "ServerPartDeals", landedPrice: 666, pricePerTB: 42, currency: "CAD", flags: [] },
  { capacityTB: 16, iface: "SAS", model: "Dell/WD HC550", condition: "Renewed", tier: "Renewed", venue: "Amazon", landedPrice: 768, pricePerTB: 48, currency: "CAD", flags: [] },
  { capacityTB: 16, iface: "SATA", model: "Toshiba MG08ACA16TE", condition: "Refurb", tier: "Refurb", venue: "goHardDrive", landedPrice: 528, pricePerTB: 33, currency: "CAD", flags: [] },
  { capacityTB: 16, iface: "SATA", model: "WD HC550", condition: "Renewed", tier: "Renewed", venue: "Amazon", landedPrice: 609, pricePerTB: 38, currency: "CAD", flags: [f("⚠", "warn", "out of stock")] },
  { capacityTB: 16, iface: "SATA", model: "Exos X16 ST16000NM001G", condition: "Renewed", tier: "Renewed", venue: "Amazon", landedPrice: 657, pricePerTB: 41, currency: "CAD", flags: [] },
];

export const ladder: LadderRung[] = [
  { combo: "8TB SAS", landed: "C$200", pricePerTB: 25, condition: "used pull · eBay", best: true },
  { combo: "12TB SAS", landed: "C$302", pricePerTB: 25, condition: "used pull · eBay", best: true },
  { combo: "16TB SAS", landed: "C$475", pricePerTB: 30, condition: "used · Vancouver", best: true },
  { combo: "8TB SATA", landed: "C$246", pricePerTB: 31, condition: "used pull", best: false },
  { combo: "16TB SATA", landed: "C$528", pricePerTB: 33, condition: "recert 5yr", best: false },
  { combo: "12TB SATA", landed: "C$419", pricePerTB: 35, condition: "used pull", best: false },
];

export const merchants: Merchant[] = [
  { venue: "eBay", seller: "hermitaj", positivePct: "100%", ratingVolume: "792", locationFlag: "🇨🇦", locationNote: "Vancouver, BC — no border", badge: { label: "THE PICK", kind: "good" } },
  { venue: "eBay", seller: "deepdiscountservers", positivePct: "99.1%", ratingVolume: "4.8K", locationFlag: "🇺🇸", locationNote: "United States — returns only", badge: { label: "CHEAPEST", kind: "neutral" } },
  { venue: "eBay", seller: "revertstore", positivePct: "99.4%", ratingVolume: "335", locationFlag: "🇺🇸", locationNote: "United States — Grade A", badge: { label: "GRADE A", kind: "good" } },
];
