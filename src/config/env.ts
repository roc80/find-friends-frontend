import type {EnvConfig as IEnvConfig, EnvType} from '@/types/env'

class EnvConfigManager {
    private readonly env: EnvType
    private readonly apiBaseUrl: string
    private readonly apiTimeout: number
    private readonly appTitle: string
    private readonly appLoginUrl: string

    constructor() {
        this.env = import.meta.env.VITE_APP_ENV || 'development'
        this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        this.apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000
        this.appTitle = import.meta.env.VITE_APP_TITLE || 'Vue App'
        this.appLoginUrl = import.meta.env.VITE_APP_LOGIN_URL || ''
    }

    // 获取完整的 API URL
    getApiUrl(endpoint: string = ''): string {
        return `${this.apiBaseUrl}${endpoint}`
    }

    // 判断当前环境
    isDevelopment(): boolean {
        return this.env === 'development'
    }

    isProduction(): boolean {
        return this.env === 'production'
    }

    isStaging(): boolean {
        return this.env === 'staging'
    }

    // 获取环境配置
    getConfig(): IEnvConfig {
        return {
            env: this.env,
            apiBaseUrl: this.apiBaseUrl,
            apiTimeout: this.apiTimeout,
            appTitle: this.appTitle,
            appLoginUrl: this.appLoginUrl,
        }
    }

    // 获取当前环境名称
    getCurrentEnv(): EnvType {
        return this.env
    }

    // 获取 API 超时时间
    getApiTimeout(): number {
        return this.apiTimeout
    }
}

export default new EnvConfigManager()