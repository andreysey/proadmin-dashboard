import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json'

const vendorGroups = {
  'vendor-core': ['react', 'react-dom', 'scheduler', '@tanstack'],
  'vendor-charts': ['recharts'],
  'vendor-forms': ['react-hook-form', '@hookform', 'zod'],
  'vendor-ui': [
    '@radix-ui', // Keep this group together
    'lucide-react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'sonner',
  ],
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: './src/app/router/routes',
      generatedRouteTree: './src/app/router/routeTree.gen.ts',
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            for (const [chunkName, keywords] of Object.entries(vendorGroups)) {
              if (keywords.some((keyword) => id.includes(keyword))) {
                return chunkName
              }
            }
          }
        },
      },
    },
  },
})
