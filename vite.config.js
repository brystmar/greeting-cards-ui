import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react({ include: /\.[jt]sx?$/ })],
    server: {
        host: true,
        port: 3000,  // default Vite port is 5713
        strictPort: true
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./src/setupTests.js"],
        globals: true,
        exclude: ["node_modules", "src/App.test.js"],
    }
})
