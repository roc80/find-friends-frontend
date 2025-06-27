import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({command, mode}) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        },
        envPrefix: 'VITE_',
        build: {
            // 生产环境移除 console 和 debugger
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: mode === 'production',
                    drop_debugger: mode === 'production',
                },
            },
        },
    }
});