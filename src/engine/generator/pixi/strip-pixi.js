import fs from "fs";
import path from "path";

const META_FILE = "meta.json";
const ALIAS_SRC = "src/engine/pixi.alias.js";
const OUTPUT_ALIAS = "src/engine/pixi.alias.strip.js";

function collectUsedPixiImports(metaFilePath) {
    if (!fs.existsSync(metaFilePath)) {
        console.error("❌ meta.json not found! Run build first.");
        process.exit(1);
    }

    const meta = JSON.parse(fs.readFileSync(metaFilePath, "utf8"));
    const usedFiles = Object.keys(meta.inputs);
    const usedExports = new Set();

    for (const filePath of usedFiles) {
        if (!filePath.endsWith(".js")) continue;
        const content = fs.readFileSync(filePath, "utf8");

        // chỉ bắt import qua @pixi.alias
        const regex = /import\s+(?:\*\s+as\s+)?(?:\{([^}]+)\}\s+)?from\s+['"]@pixi\.alias['"]/g;
        let match;
        while ((match = regex.exec(content))) {
            const imports = match[1];
            if (imports) {
                imports
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean)
                    .forEach(name => {
                        const clean = name.split(/\s+as\s+/i)[0].trim();
                        if (clean) usedExports.add(clean);
                    });
            } else {
                usedExports.add("*");
            }
        }
    }

    return usedExports;
}

function generateAliasStrip(usedExports) {
    if (usedExports.has("*")) {
        fs.copyFileSync(ALIAS_SRC, OUTPUT_ALIAS);
        console.log("⚠️ Found wildcard import (* as PIXI) → copied full alias instead.");
        return;
    }

    const content = Array.from(usedExports)
        .sort()
        .map(e => `export { ${e} } from 'pixi.js';`)
        .join("\n");

    fs.writeFileSync(OUTPUT_ALIAS, content, "utf8");
    console.log(`✅ Generated ${OUTPUT_ALIAS} with ${usedExports.size} exports`);
}

const used = collectUsedPixiImports(META_FILE);
console.log("📦 Used PIXI imports from bundle:", Array.from(used));
generateAliasStrip(used);
