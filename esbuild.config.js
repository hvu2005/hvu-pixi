import * as esbuild from "esbuild";
import babel from "esbuild-plugin-babel";
import inlineCss from "esbuild-plugin-inline-css";
import open from "open";
import fs from "fs";
import path from "path";
import { stripImports } from "./strip.import.config.js";


(async () => {
    try {
        const isProd = process.env.NODE_ENV === "production";

        if (!fs.existsSync("dist")) {
            fs.mkdirSync("dist", { recursive: true });
        }
        fs.copyFileSync("index.html", path.join("dist", "index.html"));

        const ctx = await esbuild.context({
            entryPoints: ["src/index.js"],
            bundle: true,
            sourcemap: false,
            outfile: "dist/bundle.js",
            format: "iife",
            target: ["es2017"],
            minify: true,
            // drop: ['console', 'debugger'],
            treeShaking: true,
            legalComments: 'none',
            define: {
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
                global: "globalThis",
            },
            splitting: false,
            // external: ['pixi.js', 'three'],
            // globalName: 'PIXI',
            plugins: [
                inlineCss(),
                babel({
                    filter: /\.js$/,
                    config: {
                        compact: false,
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { legacy: true }],
                            ["transform-remove-imports", {
                                test: stripImports
                            }]
                        ],
                    },
                }),
                _bundleSizePlugin(),
            ],
            loader: {
                ".png": "dataurl",
                ".jpg": "dataurl",
                ".jpeg": "dataurl",
                ".gif": "dataurl",
                ".glb": "dataurl",
                ".gltf": "dataurl",
                ".mp3": "dataurl",
                ".json": "json",
                ".atlas": "text",
                ".glsl": "text",
                ".frag": "text",
                ".vert": "text",
                '.fbx': 'dataurl',
                '.obj': 'dataurl',
                '.stl': 'dataurl',
            },
            logLevel: "info",
            metafile: true, // bật phân tích
            alias: {
                "@pixi.alias": `./src/engine/pixi.alias${isProd ? ".min" : ""}.js`,
                "@three.alias": `./src/engine/three.alias${isProd ? ".min" : ""}.js`,
            },
        });

        // Lưu metafile JSON
        const result = await ctx.rebuild();
        fs.writeFileSync('meta.json', JSON.stringify(result.metafile, null, 2));
        // console.log('✅ Build thành công! Metafile lưu ở meta.json');

        // // In phân tích ra terminal
        // const text = esbuild.analyzeMetafileSync(result.metafile, { verbose: true });
        // console.log('\n📊 Phân tích dung lượng bundle:\n');
        // console.log(text);
        // console.log('\n👉 Bạn có thể mở https://esbuild.github.io/analyze/ và upload file meta.json để xem biểu đồ trực quan.');

        // // mở browser tự động
        await _startServer(ctx);

    } catch (err) {
        console.error("Lỗi build:", err);
        process.exit(1);
    }
})();


async function _startServer(ctx, startPort = 8080, maxTries = 10) {
    const watch = await ctx.watch();

    let port;
    for (port = startPort; port < startPort + maxTries; port++) {
        try {
            const server = await ctx.serve({ port, servedir: "dist" });
            const url = `http://localhost:${port}/index.html`;
            console.log(`>>> Dev server chạy tại: ${url}`);
            await open(url);
            return server;
        } catch (err) {
            continue;
        }
    }
    throw new Error("Không tìm được port khả dụng!", startPort + "-" + port);
}

function _bundleSizePlugin() {
    let first = true;
    return {
        name: "bundle-size",
        setup(build) {
            build.onEnd(result => {
                if (first) {
                    first = false;
                    try {
                        const stats = fs.statSync("dist/bundle.js");
                        const sizeKB = (stats.size / 1024).toFixed(2);
                        console.log(`📦 Bundle size: ${sizeKB} KB`);
                    } catch {
                        console.warn("⚠️ Không đọc được bundle size.");
                    }
                }
            });
        }
    };
}

