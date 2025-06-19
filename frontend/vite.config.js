import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇👇👇 ADD base path matching your GitHub repo name
export default defineConfig({
  base: '/PDFCHATBOT/',
  plugins: [react()],
  server: {
    port: 3000
  }
})
