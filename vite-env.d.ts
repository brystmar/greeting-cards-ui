// Removes the pycharm linting for importing ENVs
interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
