import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    host: '0.0.0.0',
    port:80,
    proxy:{
        '/api':{
          changeOrigin: true,
          target:'https://hk4e-api.mihoyo.com',
          rewrite:path => path.replace(/^\/api/, '/event/gacha_info/api/getGachaLog'),
        }
      },
  }
})
