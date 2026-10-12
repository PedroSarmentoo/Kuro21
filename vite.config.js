import { defineConfig } from 'vite';

// base './' gera caminhos relativos: o build funciona em qualquer pasta,
// inclusive em GitHub Pages (https://usuario.github.io/repositorio/).
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
});
