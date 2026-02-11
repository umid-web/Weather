import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Ushbu paketlarni Vite bundl qilmaslik uchun chiqarib tashlaymiz
    exclude: [
      'babel-plugin-macros',
      '@fortawesome-internal-tools/fontawesome-icons/canonical',
      '@fortawesome-internal-tools/fontawesome-icons/legacy'
    ]
  }
})
