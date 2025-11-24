import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // comment out below if running locally
  base: '/mambu-4-eye-checks/web-app',
})
