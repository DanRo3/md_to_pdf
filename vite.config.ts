import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),
    VitePWA({ // <-- Añade la configuración del plugin
      registerType: 'autoUpdate', // Actualiza automáticamente el service worker cuando hay cambios
      injectRegister: 'auto', // O 'script' o null dependiendo de tu necesidad
      manifest: {
        name: 'Markdown a PDF',
        short_name: 'MDtoPDF',
        description: 'Una PWA para convertir Markdown a PDF en el navegador.',
        theme_color: '#ffffff', // Color de la barra de herramientas
        background_color: '#ffffff', // Color de fondo para la splash screen
        display: 'standalone', // O 'fullscreen' o 'minimal-ui'
        scope: '/',
        start_url: '/',
        icons: [ // Necesitarás crear estos iconos y ponerlos en la carpeta 'public'
          {
            src: 'pwa-192x192.png', // Ejemplo: public/pwa-192x192.png
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // Ejemplo: public/pwa-512x512.png
            sizes: '512x512',
            type: 'image/png',
          },
          { // Icono para compatibilidad con Apple y propósito 'maskable'
            src: 'pwa-maskable-512x512.png', // Ejemplo: public/pwa-maskable-512x512.png
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // 'any' o 'maskable' o 'any maskable'
          }
        ],
      },
      // Opcional: Configuración del Workbox para estrategias de caché
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'], // Archivos a cachear
         // Define estrategias de caché si necesitas más control
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          }
        ]
      }
    })
  ],
})
