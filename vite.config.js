import { defineConfig } from "vite";
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
  server: {
    port: 3000,
    allowedHosts: true,
  },
});
