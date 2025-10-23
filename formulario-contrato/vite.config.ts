import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: { 
    port: 5174,
    // Prevenir acceso desde IPs no autorizadas en desarrollo
    host: "localhost"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: { 
    outDir: "dist",
    sourcemap: false, // No exponer source maps en producción
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          motion: ["framer-motion"]
        }
      }
    }
  }
});