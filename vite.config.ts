// vite.config.ts
import { defineConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';

import path from "path";

export default defineConfig({
  css: {
    // Enables source maps during development
    devSourcemap: true,
  },

  build: {
    // This enables source maps for the production build
    sourcemap: true,
    minify: false,
    assetsInlineLimit: 0, // Важно, чтобы WASM не превратился в base64,
    rollupOptions: {
      // Гарантируем, что WASM не будет обработан как чанк
      external: [/.*\.wasm$/],
    },
  },
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["@capacitor-community/sqlite", "sql.js", "jeep-sqlite"],
  },
  server: {
    // Явно разрешаем заголовки для WASM
    fs: {
      allow: [".."],
    },
    watch: {
      usePolling: true,
    },
    // Добавляем заголовки, чтобы браузер не смел кэшировать WASM во время разработки
    headers: {
      "Cache-Control": "no-store",
    },
    port: 3000, // Replace 3000 with your desired port number
    strictPort: true, // Optional: set to true if you want Vite to fail if the port is already in use
  },
  assetsInclude: ["**/*.wasm"],
  // Настройка для корректной отдачи типов
  plugins: [

    viteStaticCopy({
      targets: [
       
        {
         
          src: 'src/server.cjs',
          dest: 'server'
        }
      ]
    })
  ],
});
