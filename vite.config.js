import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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