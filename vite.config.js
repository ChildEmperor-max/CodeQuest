import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pluginSvgVue from "@vuetter/vite-plugin-vue-svg";

export default defineConfig({
  plugins: [react(), pluginSvgVue()],
  server: {
    port: 3000,
    // port: 8000, // Specify the port for the Vite development server
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Proxy API requests to your server (change the URL to match your server setup)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  assetsInclude: "**/*.glb",
  resolve: {
    alias: {
      src: "/src",
    },
  },
  build: { chunkSizeWarningLimit: 1900 },
});
