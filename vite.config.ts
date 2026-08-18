import { defineConfig } from 'vite';

export default defineConfig({
  base: '/fluid-dynamics-capital-flow-simulator/',
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', 'three/examples/jsm/controls/OrbitControls.js'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
