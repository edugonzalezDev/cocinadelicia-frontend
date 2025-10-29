/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path"; // 👈 usa node:path
import { fileURLToPath } from "node:url"; // 👈 usa node:url
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 con ./src por claridad
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    css: true,
    globals: true,
  },
});
