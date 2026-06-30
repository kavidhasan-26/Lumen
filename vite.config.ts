import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves project sites from /repo-name/
const repoName = 'Lumen'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? `/${repoName}/` : '/',
  plugins: [react(), tailwindcss()],
})
