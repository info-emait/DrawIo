import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        base: env.VITE_APP_BASE_URL || "./",
        build: {
            outDir: "dist",
            emptyOutDir: true,
            sourcemap: false,
            rolldownOptions: {
                input: {
                    hub: resolve(__dirname, "hub.html")
                }
            }
        },
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
                "@utils": resolve(__dirname, "src/utils"),
                "@components": resolve(__dirname, "src/js/components"),
                "@bindings": resolve(__dirname, "src/js/bindings"),
                "@styles": resolve(__dirname, "src/styles")
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