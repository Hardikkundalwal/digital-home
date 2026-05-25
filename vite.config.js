import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  resolve: {
    dedupe: ['three']
  },
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webmanifest,gltf,glb,bin,zip,hdr,jpg,jpeg,webp,woff,woff2,splinecode}'
        ],
        // Only use the SPA fallback for actual page navigations,
        // NOT for /assets/*.js chunk requests (which would return index.html
        // with MIME type text/html and crash dynamic import()).
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/assets\//,   // all hashed JS/CSS chunks
          /\.\w+$/,        // any file with an extension
        ],
      },
      manifest: {
        name: 'Digital Home',
        short_name: 'Home',
        description: 'Your private digital home',
        theme_color: '#8b6f47',
        background_color: '#f5efe6',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      }
    })
  ]
});
