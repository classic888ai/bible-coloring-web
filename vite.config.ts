import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    outDir: "dist",
  },
  server: {
    host: true,
    port: 5173,
    // Allow tunneling hosts (localtunnel, cloudflare quick tunnels, ngrok)
    // so the demo URL works from any device.
    allowedHosts: true,
  },
  assetsInclude: ["**/*.glsl"],
});
