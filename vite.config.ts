import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("phaser")) {
            return "phaser";
          }
        },
      },
    },
  },
  plugins: [
    process.env.ANALYZE
      ? visualizer({
          open: true,
          filename: "dist/stats.html",
        })
      : undefined,
  ],
});
