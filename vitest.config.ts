import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    coverage: {
      exclude: [
        ".next/",
        "node_modules/",
        "out/",
        "src/common/",
        "src/components/**/index.ts",
        "src/types/",
      ],
      include: ["src/**/*.{ts,tsx}"],
      reporter: ["text", "json", "html"],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
})
