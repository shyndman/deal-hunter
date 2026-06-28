import { defineConfig } from "vite";
import { resolve } from "node:path";

// Two outputs from one repo:
//  - `vite build`         → the showcase site (default), for visual QA of the components
//  - `vite build --mode lib` → the hosted viewer bundle (dist/viewer.js + viewer.css)
export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "DealHunterViewer",
          fileName: () => "viewer.js",
          formats: ["iife"],
        },
        cssCodeSplit: false,
        rollupOptions: {
          output: { assetFileNames: "viewer.[ext]" },
        },
      },
    };
  }
  return {};
});
