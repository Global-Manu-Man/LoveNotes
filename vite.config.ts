import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Asegura que los archivos JS tengan la extensión .js
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Asegura que los assets se sirvan correctamente
    assetsDir: 'assets',
    // Genera sourcemaps para mejor debugging
    sourcemap: true
  },
  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  // Configuración de la vista previa
  preview: {
    port: 4173,
    strictPort: true,
    host: true
  }
});