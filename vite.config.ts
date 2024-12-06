import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'
import { version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Refined GitHub File Nesting',
        icon: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
        namespace: 'yuyinws/refined-github-file-nesting',
        description: 'Bring file nesting feature to GitHub',
        match: ['https://github.com/**'],
        version,
      },
    }),
  ],
})
