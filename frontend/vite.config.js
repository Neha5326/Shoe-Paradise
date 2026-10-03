import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  server: {
    proxy: {
      "/create-user": "http://localhost:6070",
      "/login": "http://localhost:6070",
      "/check-token": "http://localhost:6070",
      "/cart": "http://localhost:6070",
      "/admin-login": "http://localhost:6070",
      "/admin-check": "http://localhost:6070",
      "/orders-lao": "http://localhost:6070",
      "/users-lao": "http://localhost:6070",
      "/delete-order": "http://localhost:6070",
      "/delete-user": "http://localhost:6070",
      "/api/health": "http://localhost:6070",
    },
  },
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
});
