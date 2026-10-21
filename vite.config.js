import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Hash no nome dos arquivos finais (CSS/JS) evita qualquer problema
    // de cache em deploys futuros: cada build gera um nome novo.
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
