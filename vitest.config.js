import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.js"],
    include: ["src/**/*.{test,spec}.{ts,tsx,js,jsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
