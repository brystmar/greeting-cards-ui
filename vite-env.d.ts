// Removes the pycharm linting for importing ENVs
interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string,
    readonly DEV: string,
    readonly PROD: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
