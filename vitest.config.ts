import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./setup-vitest.ts"],
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/main.ts",
        "src/di-container.ts",
        "src/vite-env.d.ts",
        "**/*.test.ts",
        "src/state/__mocks__",
      ],
    },
  },
});
