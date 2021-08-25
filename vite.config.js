import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    proxy:{
        '/ktapi':{
        changeOrigin: true,
        target:'https://hk4e-api.mihoyo.com',
        rewrite:path => path.replace(/^\/ktapi/, '/event/gacha_info/api/getGachaLog'),
        }
      },
  }
})
