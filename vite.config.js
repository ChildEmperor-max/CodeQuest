import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
  build: {
    outDir: "dist", // Specify the output directory for the production build
  },
});
