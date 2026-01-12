import fs from "fs";
import path from "path";
import { execSync } from "child_process";

//
// 1. ĐƯỜNG DẪN CÁC FILE
//

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "game.module.config.json");
const OUTPUT_PATH = path.join(ROOT, "src/engine/service/stripped-modules.js");

//
// 2. KHÔNG TÌM THẤY FILE CONFIG
//

if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`❌ Không tìm thấy file: game.module.config.json`);
    process.exit(1);
}

//
// 3. ĐỌC CONFIG
//

const config = JSON.parse(
    fs.readFileSync(CONFIG_PATH, "utf8")
);

if (!config.modules) {
    console.error("❌ game.module.config.json phải có field 'modules'");
    process.exit(1);
}

//
// 4. SINH RA CODE IMPORT MODULES
//

let fileContent = `// AUTO-GENERATED — DO NOT EDIT\n`;
fileContent += `// Generated at ${new Date().toISOString()}\n\n`;

let exportLines = [];

for (const moduleName in config.modules) {

    const enabled = config.modules[moduleName];
    if (!enabled) continue; // module OFF => strip

    // moduleName: "physic-2d" => asLabel: physic2d
    const asLabel = moduleName.replace(/-/g, "");

    // import * as pixi from "engine/runtime/pixi";
    fileContent += `import * as ${asLabel} from "engine/runtime/${moduleName}";\n`;

    // "pixi": pixi,
    exportLines.push(`    "${asLabel}": ${asLabel}`);
}

//
// 5. TẠO OBJECT engineModules
//

fileContent += `\nexport const engineModules = {\n`;
fileContent += exportLines.join(",\n");
fileContent += `\n};\n`;

//
// 6. GHI FILE
//

fs.writeFileSync(OUTPUT_PATH, fileContent);
execSync("node esbuild.config.js", { stdio: "inherit" });
execSync("npx open http://localhost:8080/index.html", { stdio: "inherit" });