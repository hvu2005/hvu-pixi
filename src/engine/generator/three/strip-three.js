// gen-three-alias.js
import fs from "fs";
import path from "path";

const SRC_DIR = "src";
const ALIAS_SRC = "src/engine/three.alias.js";
const OUTPUT_ALIAS = "src/engine/three.alias.strip.js";

function collectThreeImports(dir, collected = new Set()) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            collectThreeImports(full, collected);
            continue;
        }

        if (file.endsWith(".js") || file.endsWith(".mjs")) {
            const content = fs.readFileSync(full, "utf8");

            // ✅ Hỗ trợ đầy đủ:
            // - three
            // - three-stdlib
            // - @three.alias
            // - engine/three.alias(.min).js
            // - three/examples/jsm/*
            const regex =
                /import\s+(?:\*\s+as\s+)?(?:\{([^}]+)\}\s+)?from\s+['"](?:(?:@three\.alias|three(?:-stdlib)?|three\/examples\/jsm\/[\\w\/.-]+|(?:\.\/)?engine\/three(?:\.min)?\.alias(?:\.js)?))['"]/g;


            let match;
            while ((match = regex.exec(content))) {
                const imports = match[1];
                if (imports) {
                    imports
                        .split(",")
                        .map(s => s.trim())
                        .filter(Boolean)
                        .forEach(name => {
                            // Xóa alias (vd: "Mesh as ThreeMesh" -> "Mesh")
                            const clean = name.split(/\s+as\s+/i)[0].trim();
                            if (clean) collected.add(clean);
                        });
                } else {
                    // import * as THREE from 'three'
                    collected.add("*");
                }
            }
        }
    }
    return collected;
}

function generateAliasStrip(usedExports) {
    if (usedExports.has("*")) {
        fs.copyFileSync(ALIAS_SRC, OUTPUT_ALIAS);
        console.log("⚠️ Found wildcard import (* as THREE) → copied full alias instead.");
        return;
    }

    const content =
        Array.from(usedExports)
            .sort()
            .map(e => {
                if (e === "GLTFLoader") return `export { GLTFLoader } from 'three-stdlib';`;
                return `export { ${e} } from 'three';`;
            })
            .join("\n") + "\n";

    fs.writeFileSync(OUTPUT_ALIAS, content, "utf8");
    console.log(`✅ Generated ${OUTPUT_ALIAS} with ${usedExports.size} exports`);
}

// 🧩 Thực thi
const used = collectThreeImports(SRC_DIR);
console.log("📦 Found THREE imports:", Array.from(used));
generateAliasStrip(used);
