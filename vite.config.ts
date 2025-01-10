import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
/// <reference types="vitest" />
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ["reka-ui", "tailwind-variants"],
  },

  resolve: {
    alias: {
      "@/ui/*": resolve(__dirname, "src/components/ui/*"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
  },
});
