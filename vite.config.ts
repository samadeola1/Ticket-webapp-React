import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // Import path for alias

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { // Add resolve for path alias (if using)
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})