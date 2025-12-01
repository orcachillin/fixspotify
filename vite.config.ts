// vite.config.ts

import 'dotenv/config';
import { defineConfig } from "vite";
import { readdirSync } from "fs";
import { resolve } from "path";
import replace from "@rollup/plugin-replace";

const pagesDir = resolve(__dirname, "client/pages");
const pages = readdirSync(pagesDir).map(page => page.replace(".html", ""));

const routes: Record<string, string> = {};

for (const page of pages) {
    routes[page] = `client/pages/${page}.html`;
}

export default defineConfig({
    root: "client",
    build: {
        target: "esnext",
        outDir: "../dist/client",
        assetsDir: "_",
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: routes,
            plugins: [

            ]
        }
    },
    server: {
        open: true,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },
    plugins: [
        replace({
            preventAssignment: true,
            include: ["**/*.html"],
            values: {
                "CF_ANALYTICS": process.env.CF_ANALYTICS_ID ? `{'token': '${process.env.CF_ANALYTICS_ID}'}` : "''",
            }
        }),
    ]
});
