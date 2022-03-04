import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const { resolve } = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "/images": "src/assets/images",
      "/js": "src/assets/js",
      "/music": "src/assets/music",
    },
  },
});
