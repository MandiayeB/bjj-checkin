import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      base: '/bjj-checkin/',
      manifest: {
        name: 'GFA Présences',
        short_name: 'GFA',
        description: 'Application de présences pour Group Fight Academy',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/bjj-checkin/src/assets/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/bjj-checkin/src/assets/logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/bjj-checkin/src/assets/logo.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/bjj-checkin/src/assets/logo.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/bjj-checkin/src/assets/logo.png',
            sizes: '167x167',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: false
      }
    })
  ],
  base: '/bjj-checkin/',
})
