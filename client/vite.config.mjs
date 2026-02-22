import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
        '@': path.resolve(__dirname, './src'), // <--- dit is belangrijk
        },
    },    
    server: {
        host: true,
        port: 3000,
        open: true,
        proxy: {
            '/api': 'http://localhost:3001'
        }
    },
})

