import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
    server: {
    port: 3000, // choisis ton port ici
    host: true  // optionnel : permet l'accès depuis le réseau local
  }
})

