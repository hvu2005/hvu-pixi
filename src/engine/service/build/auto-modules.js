import fs from "fs";
import path from "path";

//
// 1. DEFINE PATHS
//

const ROOT = process.cwd();

const CONFIG_PATH = path.join(ROOT, "game.module.config.json");

const ENABLED_OUTPUT_PATH = path.join(
    ROOT,
    "src/engine/service/auto-generated/stripped-modules.generated.js"
);

const DISABLED_OUTPUT_PATH = path.join(
    ROOT,
    "src/engine/service/auto-generated/disabled-modules.generated.js"
);

//
// 2. LOAD game.module.config.json
//

if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`❌ Không tìm thấy file: game.module.config.json`);
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

if (!config.modules) {
    console.error("❌ game.module.config.json phải có field 'modules'");
    process.exit(1);
}

//
// 3. BUILD ENABLED MODULES FILE
//

let enabledContent = `// AUTO-GENERATED — DO NOT EDIT\n`;
enabledContent += `// Generated at ${new Date().toISOString()}\n\n`;

let exportLines = [];

for (const moduleName in config.modules) {
    const enabled = config.modules[moduleName];
    if (!enabled) continue;

    // strip dashes
    const asLabel = moduleName.replace(/-/g, "");

    enabledContent += `import * as ${asLabel} from "engine/modules/${moduleName}";\n`;
    exportLines.push(`    "${asLabel}": ${asLabel}`);
}

enabledContent += `\nexport const engineModules = {\n`;
enabledContent += exportLines.join(",\n");
enabledContent += `\n};\n`;

//
// 4. WRITE enabled file
//

fs.writeFileSync(ENABLED_OUTPUT_PATH, enabledContent);

//
// 5. BUILD DISABLED MODULES FILE (cho việc log lỗi / block import)
//

let disabledContent = `// AUTO-GENERATED — DO NOT EDIT\n`;
disabledContent += `// Generated at ${new Date().toISOString()}\n\n`;

let disabledList = [];

for (const moduleName in config.modules) {
    const enabled = config.modules[moduleName];
    if (!enabled) {
        const asLabel = moduleName.replace(/-/g, "");

        disabledContent += `import * as ${asLabel} from "engine/modules/${moduleName}";\n`;
        disabledList.push(`    "${asLabel}": ${asLabel}`);
    }
}

disabledContent += `\nexport const disabledModules = {\n`;
disabledContent += disabledList.join(",\n");
disabledContent += `\n};\n`;
//
// 6. WRITE disabled file
//

fs.writeFileSync(DISABLED_OUTPUT_PATH, disabledContent);
