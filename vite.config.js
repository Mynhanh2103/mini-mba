import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Dòng này cực kỳ quan trọng để deploy
  build: {
    outDir: "dist",
  },
});
