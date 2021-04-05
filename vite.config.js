import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // server: {
  //   port:3000,
  //   open:true,
  //   proxy: {
  //     '/apis': {
  //       target: 'https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog',
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/apis/, '')
  //     }
  //   }
  // },
})