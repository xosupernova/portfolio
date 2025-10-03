/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
// Vite config dedicated to static SPA build (no SSR, no TanStack Start plugin)
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    viteReact(),
  ],
  define: {
    __SPA_BUILD__: 'true',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
  outDir: '.tanstack/start/build/client-dist',
  emptyOutDir: true,
  manifest: true,
    rollupOptions: {
      input: {
        spa: fileURLToPath(new URL('./src/spa-entry.tsx', import.meta.url)),
      },
      output: {
        // Basic vendor chunk splitting to reduce initial bundle size
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['@tanstack/react-router', '@tanstack/react-router-devtools'],
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          iconify: ['@iconify/react'],
        },
      },
    },
    sourcemap: true,
  },
});