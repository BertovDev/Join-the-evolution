import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

// https://vite.dev/config/
export default defineConfig({
  worker: {
    format: "es",
  },
  plugins: [
    react(),
    glsl({
      include: ["**/*.glsl", "**/*.vert", "**/*.frag", "**/*.vs", "**/*.fs"],
      watch: true,
      defaultExtension: "glsl",
    }),
  ],
  root: "",
  base: "./",
  server: {
    watch: {
      usePolling: true,
    },
  },
});
