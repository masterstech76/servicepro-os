import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "server-only": path.resolve(__dirname, "./tests/unit/server-only-shim.ts"),
      "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "./config"),
    },
  },
});
