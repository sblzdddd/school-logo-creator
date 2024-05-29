import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer';

const prefix = "SLC"
const assetFile = `${prefix}.[name].[hash].[ext]`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      emitFile: false,
      filename: 'analysis-chart.html',
      open: true
    })
  ],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: `js/${prefix}.[hash].js`,
        chunkFileNames: `js/${prefix}.[name].[hash].js`,
        assetFileNames(meta) {
          if(!meta || !meta.name) {return `assets/${assetFile}`}
          if(meta.name.endsWith(".css")) {
            return `css/${assetFile}`
          }
          else if(['.png', '.jpg', '.jpeg', '.svg', '.webp', '.avif', '.gif'].some(ext => meta.name.endsWith(ext))) {
            return `images/${assetFile}`
          }
          else if(['.ttf', '.woff', '.otf'].some(ext => meta.name.endsWith(ext))) {
            return `fonts/${assetFile}`
          }
          return `assets/${assetFile}`
        },
      }
    }
  }
})
