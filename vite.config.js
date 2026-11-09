import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    global: "globalThis",
  },
  build: {
    outDir: "build",
  },
  test: {
    exclude: [...configDefaults.exclude, "backend/**", ".build/**"],
  },
  server: {
    port: 3000,
    allowedHosts: true,
  },
});
