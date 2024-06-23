import path from "path";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mkcert(),
    react(),
    wasm(),
    topLevelAwait(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        "/assets/favicon.ico",
        "/assets/apple-touch-icon.png",
        "/assets/masked-icon.svg",
      ],
      manifest: {
        name: "zKastle",
        short_name: "zKastle",
        description:
          "Solo strategy card game where you manage resources and upgrade your village to maximize points. Make tactical decisions to help your village grow and flourish.",
        theme_color: "#000000",
        icons: [
          {
            src: "/assets/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/assets/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/assets/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Allow access from local network
  },
});
