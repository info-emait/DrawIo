import { defineConfig, loadEnv } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        base: env.VITE_APP_BASE_URL || "/",
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@utils": path.resolve(__dirname, "src/js/utils"),
                "@components": path.resolve(__dirname, "src/js/components"),
                "@bindings": path.resolve(__dirname, "src/js/bindings"),
                "@styles": path.resolve(__dirname, "src/styles")
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps: true
                }
            }
        }
    };
});