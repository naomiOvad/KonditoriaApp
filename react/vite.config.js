import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// noop: second PR agent smoke test
export default defineConfig({
  plugins: [react()],
})
