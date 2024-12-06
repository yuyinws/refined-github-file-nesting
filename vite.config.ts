import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'
import { version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://github.com/**'],
        version,
      },
    }),
  ],
})
