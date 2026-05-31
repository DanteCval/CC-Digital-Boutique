import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png"
      ],
      manifest: {
        name: "C&C Boutique",
        short_name: "C&C Boutique",
        description: "Catálogo digital de ropa para dama",
        theme_color: "#ec4899",
        background_color: "#fdf2f8",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
  globPatterns: ["**/*.{js,css,html,png,svg,jpg,jpeg}"],
  navigateFallback: "/index.html",
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "product-images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: ({ url }) =>
        url.pathname.startsWith("/api/products") ||
        url.pathname.startsWith("/api/categories"),
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    },
  ],
},
      devOptions: {
        enabled: true
      }
    })
  ]
});