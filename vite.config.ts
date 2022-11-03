import { defineConfig } from 'vite'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  manifest: {
    name: 'Schedule',
    short_name: 'Schedule',
    theme_color: '#1f4068',
    background_color: '#e43f5a',
    icons: [
      {
        src: "icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any"
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,png,svg}'],
  },
  devOptions: {
    enabled: true,
  }
}

export default defineConfig({
  base: '',
  plugins: [
    VitePWA(pwaOptions),
  ],
  build: {
    sourcemap: true,
  }
})