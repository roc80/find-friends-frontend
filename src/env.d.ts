interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
    readonly VITE_API_TIMEOUT: string
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_LOGIN_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}