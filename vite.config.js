import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/music-symbol-quest_v1/',
  plugins: [react(), tailwindcss()],
})
