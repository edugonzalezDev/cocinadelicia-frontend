import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Podés overridear cosas acá si querés, pero con heredar ya alcanza.
    },
  }),
);
