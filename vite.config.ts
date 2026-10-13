import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async ({ mode }) => {
  const devPlugins =
    mode === "development"
      ? [(await import("lovable-tagger")).componentTagger()]
      : [];

  return {
  // Root URL on Hostinger/Vercel — required so /models/vf7 loads /assets/* correctly
  base: "/",

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [react(), ...devPlugins],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
});