import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'],
      },
      devOptions: {
        enabled: true,
      }
    })
  ],
  build: {
    sourcemap: true,
  }
})