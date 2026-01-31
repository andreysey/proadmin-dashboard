import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

import { visualizer } from 'rollup-plugin-visualizer'

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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tanstack-vendor': ['@tanstack/react-router', '@tanstack/react-query'],
          'ui-vendor': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            'lucide-react',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'sonner',
          ],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
  },
})
