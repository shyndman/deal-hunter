import type { Item, Dataset } from "./contract";

// FX from doc header (x-rates.com, 2026-06-28); HST = Ontario 13%.
const FX: Record<"CAD" | "USD" | "HKD", number> = {
  CAD: 1,
  USD: 1.419023,
  HKD: 0.180943,
};
const HST = 1.13;

type SiliconKey = "4090" | "4090D" | "4080" | "4080S" | "W7800" | "W7900" | "W7900-DS";
type Cooling = "blower" | "turbo" | "AIO" | "3-fan";

interface Spec {
  model: string;
  vendor: string;
  arch: string;
  compute: string;
  vramGB: number;
  vramType: "GDDR6X" | "GDDR6";
  busBits: number;
  tops: number;
  tdpW: number;
  lengthMm: number;
  slots: number;
  cooling: Cooling;
}

// Committed approximate specs. tops = dense INT8 TOPS (no sparsity) so NVIDIA
// Tensor and AMD WMMA are comparable; tuning knob: edit a value here.
const SPECS: Record<SiliconKey, Spec> = {
  "4090": { model: "RTX 4090", vendor: "NVIDIA", arch: "Ada Lovelace", compute: "CUDA", vramGB: 48, vramType: "GDDR6X", busBits: 384, tops: 660, tdpW: 450, lengthMm: 268, slots: 2, cooling: "blower" },
  "4090D": { model: "RTX 4090 D", vendor: "NVIDIA", arch: "Ada Lovelace", compute: "CUDA", vramGB: 48, vramType: "GDDR6X", busBits: 384, tops: 580, tdpW: 425, lengthMm: 268, slots: 2, cooling: "blower" },
  "4080": { model: "RTX 4080", vendor: "NVIDIA", arch: "Ada Lovelace", compute: "CUDA", vramGB: 32, vramType: "GDDR6X", busBits: 256, tops: 390, tdpW: 320, lengthMm: 268, slots: 2, cooling: "blower" },
  "4080S": { model: "RTX 4080 Super", vendor: "NVIDIA", arch: "Ada Lovelace", compute: "CUDA", vramGB: 32, vramType: "GDDR6X", busBits: 256, tops: 418, tdpW: 320, lengthMm: 268, slots: 2, cooling: "blower" },
  W7800: { model: "Radeon PRO W7800", vendor: "AMD", arch: "RDNA 3", compute: "ROCm", vramGB: 32, vramType: "GDDR6", busBits: 256, tops: 180, tdpW: 260, lengthMm: 267, slots: 2, cooling: "blower" },
  W7900: { model: "Radeon PRO W7900", vendor: "AMD", arch: "RDNA 3", compute: "ROCm", vramGB: 48, vramType: "GDDR6", busBits: 384, tops: 245, tdpW: 295, lengthMm: 267, slots: 3, cooling: "blower" },
  "W7900-DS": { model: "Radeon PRO W7900 (Dual-Slot)", vendor: "AMD", arch: "RDNA 3", compute: "ROCm", vramGB: 48, vramType: "GDDR6", busBits: 384, tops: 245, tdpW: 295, lengthMm: 267, slots: 2, cooling: "blower" },
};

interface Raw {
  silicon: SiliconKey;
  venue: string;
  seller?: string;
  region: string; // CN HK US UK IL CH CA MY
  condition: string; // New | Used | Open Box | New (Other)
  nativePrice: number;
  currency: "CAD" | "USD" | "HKD";
  nativeShip: number;
  cooling?: Cooling;
  slots?: number;
  vramType?: "GDDR6X" | "GDDR6";
  busBits?: number;
  warn?: boolean;
  url: string;
}

// FNV-1a 32-bit -> base36, first 5 chars.
function makeId(url: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36).padStart(5, "0").slice(0, 5);
}

const ROWS: Raw[] = [
  // A1 · RTX 4090 — eBay.ca (native CAD)
  { silicon: "4090D", venue: "eBay", seller: "memorypartner_ltd", region: "CN", condition: "New", nativePrice: 5890.93, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/226872452972" },
  { silicon: "4090D", venue: "eBay", seller: "kuaka03", region: "CN", condition: "New", nativePrice: 5994.09, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/800082328496" },
  { silicon: "4090D", venue: "eBay", seller: "yiermei", region: "CN", condition: "New", nativePrice: 5994.09, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/397998120166" },
  { silicon: "4090", venue: "eBay", seller: "ry-harddrive", region: "CN", condition: "New", nativePrice: 6031.46, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/168323571812" },
  { silicon: "4090D", venue: "eBay", seller: "liulong-1", region: "CN", condition: "New", nativePrice: 6224.51, currency: "CAD", nativeShip: 0, warn: true, url: "https://www.ebay.ca/itm/398066735302" },
  { silicon: "4090D", venue: "eBay", seller: "ry-harddrive", region: "CN", condition: "New", nativePrice: 6227.35, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/168324840886" },
  { silicon: "4090D", venue: "eBay", seller: "kuaka04", region: "CN", condition: "New", nativePrice: 6228.77, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/206376142749" },
  { silicon: "4090D", venue: "eBay", seller: "fullyautomated", region: "CN", condition: "New", nativePrice: 6267.09, currency: "CAD", nativeShip: 28.39, url: "https://www.ebay.ca/itm/397990570570" },
  { silicon: "4090", venue: "eBay", seller: "zhou_pc", region: "HK", condition: "New", nativePrice: 6386.33, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/267161248577" },
  { silicon: "4090", venue: "eBay", seller: "e-dealsglobal", region: "CN", condition: "New", nativePrice: 6528.07, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/206287013011" },
  { silicon: "4090", venue: "eBay", seller: "fuxindongli", region: "CN", condition: "Used", nativePrice: 6671.65, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/198347116965" },
  { silicon: "4090", venue: "eBay", seller: "bodorship", region: "CN", condition: "New", nativePrice: 6742.63, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/127910760439" },
  { silicon: "4090", venue: "eBay", seller: "eap2019", region: "US", condition: "New", nativePrice: 6941.34, currency: "CAD", nativeShip: 134.84, url: "https://www.ebay.ca/itm/227143676586" },
  { silicon: "4090", venue: "eBay", seller: "laiman2020", region: "CN", condition: "New", nativePrice: 7807.25, currency: "CAD", nativeShip: 28.39, cooling: "AIO", slots: 1, warn: true, url: "https://www.ebay.ca/itm/227400600326" },

  // A1 · RTX 4090 — AliExpress (native CAD)
  { silicon: "4090", venue: "AliExpress", seller: "Shop1105085667", region: "CN", condition: "New", nativePrice: 5599.1, currency: "CAD", nativeShip: 266, url: "https://www.aliexpress.com/item/1005010472573613.html" },
  { silicon: "4090D", venue: "AliExpress", seller: "Shop1104557156", region: "CN", condition: "New", nativePrice: 6547.88, currency: "CAD", nativeShip: 53.17, url: "https://www.aliexpress.com/item/1005010222718732.html" },
  { silicon: "4090", venue: "AliExpress", seller: "BL039", region: "CN", condition: "New", nativePrice: 7952.68, currency: "CAD", nativeShip: 19.73, url: "https://www.aliexpress.com/item/1005011904028552.html" },
  { silicon: "4090", venue: "AliExpress", seller: "Jin Store 0739", region: "CN", condition: "New", nativePrice: 8538.69, currency: "CAD", nativeShip: 188.48, url: "https://www.aliexpress.com/item/1005010550810764.html" },
  { silicon: "4090", venue: "AliExpress", seller: "Jin Store 0739", region: "CN", condition: "New", nativePrice: 9305.38, currency: "CAD", nativeShip: 188.48, url: "https://www.aliexpress.com/item/1005010550937369.html" },
  { silicon: "4090", venue: "AliExpress", seller: "Gagamai Store", region: "CN", condition: "New", nativePrice: 10031.38, currency: "CAD", nativeShip: 0, url: "https://www.aliexpress.com/item/1005011982283157.html" },
  { silicon: "4090", venue: "AliExpress", seller: "Oriana 1 Store", region: "CN", condition: "New", nativePrice: 10052.99, currency: "CAD", nativeShip: 130.02, url: "https://www.aliexpress.com/item/1005011557824479.html" },
  { silicon: "4090", venue: "AliExpress", seller: "Spring Admire27", region: "CN", condition: "New", nativePrice: 10148.38, currency: "CAD", nativeShip: 130.02, url: "https://www.aliexpress.com/item/1005011688992481.html" },
  { silicon: "4090", venue: "AliExpress", seller: "Shop1105286873", region: "CN", condition: "New", nativePrice: 10980.75, currency: "CAD", nativeShip: 41.68, url: "https://www.aliexpress.com/item/1005010775236463.html" },

  // A1 · RTX 4090 — Alibaba (USD, low end of range, +freight)
  { silicon: "4090D", venue: "Alibaba", seller: "Xulianjiesen", region: "CN", condition: "New", nativePrice: 3625, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/High-Performance-GeForce-RTX-4090-D_1601606409486.html" },
  { silicon: "4090D", venue: "Alibaba", seller: "HK Xinyun", region: "HK", condition: "New", nativePrice: 4833, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/Low-Price-4090-D-48GB-Graphics_1601618336597.html" },
  { silicon: "4090", venue: "Alibaba", seller: "Ali Xin Chao", region: "CN", condition: "New", nativePrice: 4733, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/New-Deep-Learning-Workstation-Server-GPU_1601754700264.html" },
  { silicon: "4090", venue: "Alibaba", seller: "Beijing Yiwang", region: "CN", condition: "New", nativePrice: 4301, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/New-RTX-4090-48GB-Graphics-Card_1601812297949.html" },
  { silicon: "4090", venue: "Alibaba", seller: "Beijing Zai Ming", region: "CN", condition: "New", nativePrice: 5200, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/RTX4090-48GB-GDDR6X-High-Performance-Graphics_1601585571444.html" },
  { silicon: "4090", venue: "Alibaba", seller: "Beijing Jiayetongchuang", region: "CN", condition: "New", nativePrice: 4831, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/RTX4090-Turbo-AI-Deep-Learning-Professional_1601399367889.html" },
  { silicon: "4090", venue: "Alibaba", seller: "AiLFond", region: "HK", condition: "New", nativePrice: 4872, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/Geforce-RTX-4090-48GB-PCIE-Gaming_1601588113675.html" },
  { silicon: "4090", venue: "Alibaba", seller: "JLS Future", region: "HK", condition: "New", nativePrice: 5735, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/Professional-Computing-GPU-GeForce-RTX-4090_1601760073544.html" },
  { silicon: "4090", venue: "Alibaba", seller: "Huateng", region: "CN", condition: "New", nativePrice: 5992, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/RTX-4090-48GB-96GB-for-DeepSeek_1601588664246.html" },
  { silicon: "4090D", venue: "Alibaba", seller: "Shanghai Qingguang", region: "CN", condition: "New", nativePrice: 5170, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/RTX-4090D-48G-Server-Graphics-Card_1601698960056.html" },

  // A1 · RTX 4090 — Specialty
  { silicon: "4090", venue: "GPUAiServer", region: "US", condition: "New", nativePrice: 4040, currency: "USD", nativeShip: 0, url: "https://gpuaiserver.com/products/nvidia-geforce-rtx-4090-48gb-gddr6x-ultimate-performance-for-ai-rendering-8k-gaming" },
  { silicon: "4090", venue: "MillionMiner", region: "US", condition: "New", nativePrice: 4633, currency: "USD", nativeShip: 0, url: "https://millionminer.com/product/ai-hardware/nvidia-rtx-4090-48gb-blower" },
  { silicon: "4090", venue: "gpulab", region: "US", condition: "New", nativePrice: 4299, currency: "USD", nativeShip: 25, url: "https://gpulab.net/product?id=2" },
  { silicon: "4090D", venue: "globy", region: "MY", condition: "New", nativePrice: 4900, currency: "USD", nativeShip: 0, url: "https://globy.com/b2bmarket/listing/products/geforce-rtx-4090-d-48gb-founders-edition-deep-learning-ai-graphics-card-oem-bf27c1" },
  { silicon: "4090D", venue: "C2", region: "HK", condition: "New", nativePrice: 29500, currency: "HKD", nativeShip: 0, vramType: "GDDR6", busBits: 256, url: "https://www.c2-computer.com/products/new-parallel-nvidia-rtx-4090d-48gb-gddr6-256-bit-gpu-blower-edition" },
  { silicon: "4090", venue: "C2", region: "HK", condition: "New", nativePrice: 29800, currency: "HKD", nativeShip: 0, url: "https://www.c2-computer.com/products/new-parallel-nvidia-rtx-4090-48gb-384bit-gddr6x-graphics-card-1" },

  // A2 · RTX 4080 — eBay.ca (native CAD, ship from China)
  { silicon: "4080", venue: "eBay", seller: "cloud_future", region: "CN", condition: "New", nativePrice: 3121.48, currency: "CAD", nativeShip: 14.2, url: "https://www.ebay.ca/itm/127917825820" },
  { silicon: "4080S", venue: "eBay", seller: "quark_12", region: "CN", condition: "New", nativePrice: 3235.04, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/366135955240" },
  { silicon: "4080S", venue: "eBay", seller: "e-dealsglobal", region: "CN", condition: "New", nativePrice: 3264.85, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/205899363996" },
  { silicon: "4080S", venue: "eBay", seller: "cloud_future", region: "CN", condition: "New", nativePrice: 3314.53, currency: "CAD", nativeShip: 14.2, url: "https://www.ebay.ca/itm/127917866624" },
  { silicon: "4080", venue: "eBay", seller: "turozo-auto-parts", region: "CN", condition: "New", nativePrice: 3332.99, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/358638498411" },
  { silicon: "4080", venue: "eBay", seller: "halbry", region: "CN", condition: "New", nativePrice: 3335.83, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/336464591185" },
  { silicon: "4080S", venue: "eBay", seller: "e-dealsglobal", region: "CN", condition: "New", nativePrice: 3335.83, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/206287013104" },
  { silicon: "4080", venue: "eBay", seller: "kuaka02", region: "CN", condition: "New", nativePrice: 3405.38, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/227358930065" },
  { silicon: "4080", venue: "eBay", seller: "kuaka03", region: "CN", condition: "New", nativePrice: 3405.38, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/800077817693" },
  { silicon: "4080S", venue: "eBay", seller: "hkcomputers", region: "CN", condition: "New", nativePrice: 3547.33, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/800229653878" },
  { silicon: "4080S", venue: "eBay", seller: "squaredpartner", region: "CN", condition: "New", nativePrice: 3548.75, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/397537416064" },
  { silicon: "4080S", venue: "eBay", seller: "stelluxtech", region: "CN", condition: "New", nativePrice: 3548.75, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/800199797759" },
  { silicon: "4080S", venue: "eBay", seller: "long2207", region: "CN", condition: "New", nativePrice: 3558.23, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/389314989958" },
  { silicon: "4080S", venue: "eBay", seller: "aihardware", region: "CN", condition: "New", nativePrice: 3619.73, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/397239289690" },
  { silicon: "4080S", venue: "eBay", seller: "halbry", region: "CN", condition: "New", nativePrice: 3619.73, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/336498496382" },
  { silicon: "4080S", venue: "eBay", seller: "long2207", region: "CN", condition: "New", nativePrice: 3673.67, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/389315000674" },
  { silicon: "4080", venue: "eBay", seller: "bodorship", region: "CN", condition: "New", nativePrice: 3689.28, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/127400325123" },
  { silicon: "4080", venue: "eBay", seller: "kuaka04", region: "CN", condition: "New", nativePrice: 3689.28, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/205751763867" },
  { silicon: "4080", venue: "eBay", seller: "motorpartners", region: "CN", condition: "New", nativePrice: 3689.28, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/127400173550" },
  { silicon: "4080S", venue: "eBay", seller: "liulong-1", region: "CN", condition: "New", nativePrice: 3815.62, currency: "CAD", nativeShip: 0, warn: true, url: "https://www.ebay.ca/itm/398066698262" },
  { silicon: "4080", venue: "eBay", seller: "quark_12", region: "CN", condition: "New", nativePrice: 4399.03, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/366135955242" },

  // A2 · RTX 4080 — Alibaba (USD, low end, +freight)
  { silicon: "4080", venue: "Alibaba", seller: "Xulianjiesen", region: "CN", condition: "New", nativePrice: 1576, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/Geoforce-RTX-4080-16GB-32GB-GDDR6X_1601692606425.html" },
  { silicon: "4080", venue: "Alibaba", seller: "Huateng", region: "CN", condition: "New", nativePrice: 2302, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/Hot-selling-RTX-4080-32G-New_1601724379723.html" },
  { silicon: "4080", venue: "Alibaba", seller: "AiLFond", region: "HK", condition: "New", nativePrice: 1872, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/RTX-4080-32GB-GDDR6X-Turbo-New_1601740628258.html" },
  { silicon: "4080", venue: "Alibaba", seller: "Suqiao", region: "CN", condition: "New", nativePrice: 2553, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/RTX-4080-32GB-Turbo-Edition-PCIe_1601675055234.html" },
  { silicon: "4080", venue: "Alibaba", seller: "Beijing Yiwang", region: "CN", condition: "New", nativePrice: 1433, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/RTX-4080-32GB-Turbo-Edition-PCIe_1601675055234.html" },
  { silicon: "4080S", venue: "Alibaba", seller: "Huateng", region: "CN", condition: "New", nativePrice: 2537, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/OEM-RTX-4080-Super-Turbo-32GB_1601816118356.html" },
  { silicon: "4080S", venue: "Alibaba", seller: "Xulianjiesen", region: "CN", condition: "New", nativePrice: 2395, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/GPU-RTX4080-Super-32GB-Fan-Cooled_1601813226806.html" },
  { silicon: "4080S", venue: "Alibaba", seller: "Suqiao", region: "CN", condition: "New", nativePrice: 2531, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/RTX-4080-Super-32GB-GDDR6X-256bit_1601675379882.html" },
  { silicon: "4080S", venue: "Alibaba", seller: "AiLFond", region: "HK", condition: "New", nativePrice: 2144, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/RTX-4080-SUPER-32GB-GDDR6X-Turbo_1601740599721.html" },
  { silicon: "4080S", venue: "Alibaba", seller: "Aochuangshi", region: "CN", condition: "New", nativePrice: 3227, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/OEM-4080-Super-Turbo-32GB.html" },

  // A2 · RTX 4080 — Specialty
  { silicon: "4080S", venue: "gpulab", region: "US", condition: "New", nativePrice: 2129.99, currency: "USD", nativeShip: 0, url: "https://gpulab.net/product?id=4" },

  // A3 · W7800 — eBay.ca (native CAD)
  { silicon: "W7800", venue: "eBay", seller: "763guy", region: "CN", condition: "Open Box", nativePrice: 1999.0, currency: "CAD", nativeShip: 11.75, warn: true, url: "https://www.ebay.ca/itm/267631511880" },
  { silicon: "W7800", venue: "eBay", seller: "fuxindongli", region: "CN", condition: "New (Other)", nativePrice: 2058.28, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/198378890604" },
  { silicon: "W7800", venue: "eBay", seller: "mr.panda", region: "CN", condition: "Used", nativePrice: 2129.25, currency: "CAD", nativeShip: 9.94, url: "https://www.ebay.ca/itm/366396140211" },
  { silicon: "W7800", venue: "eBay", seller: "zhou_pc", region: "HK", condition: "New", nativePrice: 2411.73, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/267540727531" },
  { silicon: "W7800", venue: "eBay", seller: "zhou_pc", region: "US", condition: "New", nativePrice: 2411.73, currency: "CAD", nativeShip: 56.78, url: "https://www.ebay.ca/itm/267600568319" },
  { silicon: "W7800", venue: "eBay", seller: "ai_compute_depot", region: "CN", condition: "New", nativePrice: 2702.73, currency: "CAD", nativeShip: 0, warn: true, url: "https://www.ebay.ca/itm/358689316427" },
  { silicon: "W7800", venue: "eBay", seller: "motorpartners", region: "CN", condition: "New", nativePrice: 3670.83, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/127404489459" },
  { silicon: "W7800", venue: "eBay", seller: "digi-techx", region: "CH", condition: "New", nativePrice: 3863.87, currency: "CAD", nativeShip: 71.88, url: "https://www.ebay.ca/itm/298073252201" },
  { silicon: "W7800", venue: "eBay", seller: "slava-m", region: "IL", condition: "New", nativePrice: 3914.84, currency: "CAD", nativeShip: 92.13, url: "https://www.ebay.ca/itm/257083241940" },
  { silicon: "W7800", venue: "eBay", seller: "pcboost", region: "UK", condition: "New", nativePrice: 4270.23, currency: "CAD", nativeShip: 334.48, url: "https://www.ebay.ca/itm/287369936545" },
  { silicon: "W7800", venue: "eBay", seller: "quark_12", region: "CN", condition: "New", nativePrice: 4957.6, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/365325170454" },

  // A3 · W7800 — Alibaba / retail
  { silicon: "W7800", venue: "Alibaba", seller: "Suqiao", region: "CN", condition: "New", nativePrice: 1654, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/SUQIAO-New-W7800-32GB-GDDR6-Professional_1601686762214.html" },
  { silicon: "W7800", venue: "Alibaba", seller: "Huateng", region: "CN", condition: "New", nativePrice: 1851, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/Radeon-Pro-W7800-3D-Modeling-Design_1601664143471.html" },
  { silicon: "W7800", venue: "Newegg", seller: "NothingButSavings", region: "US", condition: "New", nativePrice: 2436, currency: "USD", nativeShip: 40, url: "https://www.newegg.com/p/N82E16814105115" },
  { silicon: "W7800", venue: "B&H", region: "US", condition: "New", nativePrice: 2499, currency: "USD", nativeShip: 0, url: "https://www.bhphotovideo.com/c/product/1765537-REG/amd_100_300000075_radeon_pro_w7800_graphic.html" },
  { silicon: "W7800", venue: "CDW", region: "US", condition: "New", nativePrice: 2723, currency: "USD", nativeShip: 0, url: "https://www.cdw.com/product/amd-radeon-pro-w7800-professional-graphics-card/7581266" },
  { silicon: "W7800", venue: "Amazon", region: "CA", condition: "New", nativePrice: 4169.54, currency: "CAD", nativeShip: 0, url: "https://www.amazon.ca/dp/B0C5DLBMTP" },

  // A4 · W7900 — eBay.ca (native CAD)
  { silicon: "W7900", venue: "eBay", seller: "damciccod", region: "CN", condition: "Used", nativePrice: 5500.0, currency: "CAD", nativeShip: 11.56, url: "https://www.ebay.ca/itm/318302587651" },
  { silicon: "W7900-DS", venue: "eBay", seller: "slava-m", region: "IL", condition: "New", nativePrice: 6654.47, currency: "CAD", nativeShip: 92.13, url: "https://www.ebay.ca/itm/267381895515" },
  { silicon: "W7900-DS", venue: "eBay", seller: "zepenl-0", region: "CN", condition: "New", nativePrice: 6875.9, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/176756991318" },
  { silicon: "W7900", venue: "eBay", seller: "pcboost", region: "UK", condition: "New", nativePrice: 6451.27, currency: "CAD", nativeShip: 439.8, url: "https://www.ebay.ca/itm/287369936551" },
  { silicon: "W7900-DS", venue: "eBay", seller: "memorypartner", region: "CN", condition: "New", nativePrice: 7408.37, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/336409905265" },
  { silicon: "W7900-DS", venue: "eBay", seller: "motorpartners", region: "CN", condition: "New", nativePrice: 7408.37, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/127138421314" },
  { silicon: "W7900-DS", venue: "eBay", seller: "yiermei", region: "CN", condition: "New", nativePrice: 7837.4, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/396417060258" },
  { silicon: "W7900-DS", venue: "eBay", seller: "newdisk", region: "CN", condition: "New", nativePrice: 8045.86, currency: "CAD", nativeShip: 0, url: "https://www.ebay.ca/itm/116437800048" },
  { silicon: "W7900-DS", venue: "eBay", seller: "a71852-22", region: "CN", condition: "New", nativePrice: 10333.05, currency: "CAD", nativeShip: 55.19, url: "https://www.ebay.ca/itm/317744202077" },

  // A4 · W7900 — Amazon / B&H / CDW / Newegg / Alibaba
  { silicon: "W7900", venue: "Amazon", region: "CA", condition: "Used", nativePrice: 4899.99, currency: "CAD", nativeShip: 0, url: "https://www.amazon.ca/dp/B0C5DK4R3G" },
  { silicon: "W7900-DS", venue: "B&H", region: "US", condition: "New", nativePrice: 3995, currency: "USD", nativeShip: 0, url: "https://www.bhphotovideo.com/c/product/1973610-REG/amd_100_300000170_radeon_pro_w7900_dual_slot.html" },
  { silicon: "W7900", venue: "B&H", region: "US", condition: "New", nativePrice: 3999, currency: "USD", nativeShip: 0, url: "https://www.bhphotovideo.com/c/product/1765536-REG/amd_100_300000074_radeon_pro_w7900_graphic.html" },
  { silicon: "W7900", venue: "Amazon", seller: "QyTech", region: "CA", condition: "New", nativePrice: 5999.99, currency: "CAD", nativeShip: 0, url: "https://www.amazon.ca/dp/B0C5DK4R3G" },
  { silicon: "W7900", venue: "CDW", region: "CA", condition: "New", nativePrice: 6069.99, currency: "CAD", nativeShip: 0, url: "https://www.cdw.ca/product/amd-radeon-pro-w7900-graphic-card-48-gb-gddr6-full-height/8104309" },
  { silicon: "W7900", venue: "CDW", region: "US", condition: "New", nativePrice: 4242.99, currency: "USD", nativeShip: 0, url: "https://www.cdw.com/product/amd-radeon-pro-w7900-graphic-card-48-gb-gddr6-full-height/7724708" },
  { silicon: "W7900", venue: "Newegg", seller: "Technology Galaxy", region: "US", condition: "New", nativePrice: 4581.52, currency: "USD", nativeShip: 0, url: "https://www.newegg.com/p/N82E16814105114" },
  { silicon: "W7900", venue: "Alibaba", seller: "Xiamen", region: "CN", condition: "New", nativePrice: 5276, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/AMD-Radeon-PRO-W7900-Professional-Graphics_1601660273811.html" },
  { silicon: "W7900", venue: "Alibaba", seller: "Pctech", region: "CN", condition: "New", nativePrice: 6752, currency: "USD", nativeShip: 0, url: "https://www.alibaba.com/product-detail/AMD-Radeon-Pro-W7900-48G-3D_1601254980424.html" },
  { silicon: "W7900", venue: "Newegg", seller: "Hot Deals 4 Less", region: "CA", condition: "New", nativePrice: 9675.99, currency: "CAD", nativeShip: 0, url: "https://www.newegg.ca/p/N82E16814105114" },
];

const seen = new Set<string>();
function uniqueId(url: string): string {
  let id = makeId(url);
  let n = 1;
  // Two source rows can share a URL; keep ids distinct so chart/Set logic holds.
  while (seen.has(id)) id = makeId(`${url}#${n++}`);
  seen.add(id);
  return id;
}

function build(r: Raw): Item {
  const s = SPECS[r.silicon];
  const price = Math.round(r.nativePrice * FX[r.currency]);
  const shipping = Math.round(r.nativeShip * FX[r.currency]);
  const cooling = r.cooling ?? s.cooling;
  const slots = r.slots ?? s.slots;
  const attrs: Record<string, string | number | boolean> = {
    model: s.model,
    vendor: s.vendor,
    arch: s.arch,
    compute: s.compute,
    vramGB: s.vramGB,
    vramType: r.vramType ?? s.vramType,
    busBits: r.busBits ?? s.busBits,
    tops: s.tops,
    tdpW: s.tdpW,
    lengthMm: s.lengthMm,
    slots,
    cooling,
    condition: r.condition,
    shipFrom: r.region,
    landed: Math.round((price + shipping) * HST),
  };
  return {
    id: uniqueId(r.url),
    title: `${s.model} ${s.vramGB}GB ${cooling}`,
    price,
    shipping,
    venue: r.venue,
    seller: r.seller,
    url: r.url,
    flags: r.warn ? [{ icon: "⚠", kind: "warn", label: "low feedback" }] : [],
    attrs,
  };
}

export const dataset: Dataset = {
  items: ROWS.map(build),
  facets: [
    { id: "model", label: "Model", type: "categorical" },
    { id: "vendor", label: "Vendor", type: "categorical" },
    { id: "condition", label: "Condition", type: "categorical" },
    { id: "cooling", label: "Cooling", type: "categorical" },
    { id: "shipFrom", label: "Ships from", type: "categorical" },
    { id: "vramType", label: "VRAM type", type: "categorical" },
    { id: "vramGB", label: "VRAM", type: "numeric", unit: "GB" },
    { id: "tops", label: "AI TOPS", type: "numeric", unit: "TOPS" },
    { id: "tdpW", label: "TDP", type: "numeric", unit: "W" },
    { id: "lengthMm", label: "Length", type: "numeric", unit: "mm" },
    { id: "slots", label: "Slots", type: "numeric" },
    { id: "busBits", label: "Bus", type: "numeric", unit: "bit" },
    { id: "landed", label: "Landed", type: "numeric", unit: "CAD" },
  ],
  chart: { x: "tops", y: "landed" },
};
