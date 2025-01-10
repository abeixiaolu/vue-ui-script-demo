/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import Tailwind from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [Tailwind(), vue()],
  optimizeDeps: {
    include: ["reka-ui", "tailwind-variants"],
  },

  resolve: {
    alias: {
      "@/ui/icons": resolve(__dirname, "./src/components/ui/icons"),
      "@/ui/composables": resolve(__dirname, "./src/components/ui/composables"),
      "@/ui/theme": resolve(__dirname, "./src/components/ui/theme"),
      "@/ui/keys": resolve(__dirname, "./src/components/ui/keys"),
      "@/ui/utils": resolve(__dirname, "./src/components/ui/utils"),
      "@/ui": resolve(__dirname, "./src/components/ui/components"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
  },
});
