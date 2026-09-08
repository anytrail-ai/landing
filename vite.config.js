import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Unit tests for the pure logic under src/. Node environment: nothing
  // tested here touches the DOM.
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
