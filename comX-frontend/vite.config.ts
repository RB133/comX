import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import envCompatible from "vite-plugin-env-compatible";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), envCompatible()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
