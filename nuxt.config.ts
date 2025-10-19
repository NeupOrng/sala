import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
    components: [
        {
            path: "~/components/ui", // Target the ui subdirectory
            pathPrefix: false, // Disable prefixing (e.g., UiInput -> Input)
            extensions: [".vue"], // Ensure only .vue files are scanned
        },
        {
            path: "~/components", // Include other components (optional, for components outside ui/)
            pathPrefix: true, // Keep prefix for other subdirectories if needed
        },
    ],
    imports: {
        dirs: [
            'model',
            'store'
        ]
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
        optimizeDeps: {
            exclude: ["pg"],
        },
    },
});
