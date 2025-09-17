import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
    nitro: {
        preset: "cloudflare-pages",
        externals: {
            external: ["pg-native", "pg"], // Exclude both to be safe
        },
    },
    compatibilityDate: "2025-05-15",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    modules: ["@pinia/nuxt", "shadcn-nuxt"],
    shadcn: {
        prefix: "",
        componentDir: "./components/ui",
    },
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "cloudflare:sockets": "/empty-module.js",
            },
        },
        optimizeDeps: {
            exclude: ["pg"],
        },
    },
});
