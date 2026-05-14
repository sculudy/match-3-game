import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 👇 只许写这一行！绝对不能改！就是你的仓库名
  base: '/match-3-game/'
})
