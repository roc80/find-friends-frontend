export type EnvType = 'development' | 'staging' | 'production'

export interface EnvConfig {
    env: EnvType
    apiBaseUrl: string
    apiTimeout: number
    appTitle: string
    appLoginUrl: string
}