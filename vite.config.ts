// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Asegura que los archivos se construyan en el directorio dist
    assetsDir: 'assets',
  }
})