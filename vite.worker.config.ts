import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    ssr: 'src/worker.ts',
    rollupOptions: {
      output: {
        entryFileNames: 'worker.mjs',
        format: 'esm',
      },
    },
  },
  ssr: {
    target: 'webworker',
    noExternal: true,
  },
});
