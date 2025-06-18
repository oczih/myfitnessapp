import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',  // tärkeä, että frontend käyttää SPA-tilaa
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // <- Varmista että tämä on backendin portti!
        changeOrigin: true,
        secure: false,
      },
    },
  },
})