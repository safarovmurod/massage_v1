import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load .env / .env.local / .env.[mode] and merge them into process.env.
  // Vite reads VITE_* from process.env as well, so this single path covers
  // both local .env files and platform-injected vars (Vercel, Netlify, CI).
  // NOTE: do not `define` import.meta.env.VITE_* here — a define is a raw
  // text substitution that runs before env resolution and silently overwrites
  // whatever came from .env with the value process.env had at config time.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    plugins: [react()],
    // Absolute base: the app uses BrowserRouter with nested routes (/admin/users)
    // and an SPA rewrite. With a relative base ('./') those deep routes resolve
    // assets against /admin/, hit the rewrite and get index.html back instead of JS.
    base: '/',
    build: { outDir: 'dist', sourcemap: false },
  }
})
