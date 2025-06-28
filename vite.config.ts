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
            rollupOptions: {
                onwarn(warning, warn) {
                    // 忽略关于 @hugeicons 包的特定注释警告
                    if (warning.code === 'INVALID_ANNOTATION' && warning.message.includes('@hugeicons/core-free-icons')) {
                        return;
                    }
                    // 对于其他警告，继续使用默认的控制台输出
                    warn(warning);
                },
            },
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