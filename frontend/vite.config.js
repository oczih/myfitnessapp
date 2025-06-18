import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',  // tärkeä, että frontend käyttää SPA-tilaa
  server: {
    port: 5173,
    // Vite käsittelee historia fallbackin automaattisesti appType: 'spa' -asetuksella
  },
})
