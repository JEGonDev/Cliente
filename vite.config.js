import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'AgroSena',
        short_name: 'AgroSena',
        description: 'Aplicación para la gestión de cultivos y comunidad de AgroSena',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'src/assets/header/logo2.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'src/assets/header/logo2.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      // Agregar alias para prevenir problemas con módulos
      process: "process/browser",
      stream: "stream-browserify",
      util: "util"
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Definir global para esbuild
      define: {
        global: 'globalThis'
      }
    }
  }
})