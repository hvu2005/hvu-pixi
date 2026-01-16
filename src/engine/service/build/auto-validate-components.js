import fs from "fs";
import path from "path";

const ROOT = process.cwd();

//==========================
// Tìm file disabled-modules
//==========================


const DISABLED_FILE = path.join(
    ROOT,
    "src/engine/service/auto-generated/disabled-modules.generated.js"
);

const disabledCode = fs.readFileSync(DISABLED_FILE, "utf8");

//======================================
// Lấy file path những module bị disable
//======================================

const importRegex =
    /import\s+\*\s+as\s+([A-Za-z0-9_]+)\s+from\s+["']([^"']+)["']/g;

const disabledModulePaths = []; // ["engine/modules/physic-2d"]

let match;
while ((match = importRegex.exec(disabledCode))) {
    const importPath = match[2];

    // chỉ quan tâm engine/modules/*
    if (importPath.startsWith("engine/modules/")) {
        disabledModulePaths.push(importPath);
    }
}

//========================
// Tìm index.js của module
//========================

function resolveEngineModulePath(importPath) {
    return path.join(
        ROOT,
        "src",
        importPath
    );
}

const disabledModuleIndexes = [];
for (const m of disabledModulePaths) {
    const moduleDir = resolveEngineModulePath(m);
    const indexPath = path.join(moduleDir, "index.js");

    if (fs.existsSync(indexPath)) {
        disabledModuleIndexes.push({
            module: m,
            indexPath
        });
    }
}


//================================
// Parse index.js để tìm component
//================================

function parseComponentsFromIndex(indexPath) {
    const code = fs.readFileSync(indexPath, "utf8");

    const components = [];
    const re =
        /export\s*{\s*([A-Za-z0-9_]+)\s*}\s*from\s*["']\.\/component\//g;


    let m;
    while ((m = re.exec(code))) {
        components.push(m[1]);
    }

    return components;
}

const disabledComponents = new Map();

for (const { module, indexPath } of disabledModuleIndexes) {
    const components = parseComponentsFromIndex(indexPath);
    const moduleName = module.split("/").pop();
    for (const comp of components) {
        disabledComponents.set(comp, moduleName);
    }
}

//===================
// Validate code game
//===================

const GAME_ROOT = path.join(ROOT, "src");

const IGNORE_DIRS = [
    path.join(GAME_ROOT, "engine/modules"),
    path.join(GAME_ROOT, "engine/service"),

];

function shouldIgnore(dir) {
    return IGNORE_DIRS.some(ignore =>
        dir.startsWith(ignore)
    );
}

function walk(dir, files = []) {
    if (shouldIgnore(dir)) return files;

    for (const f of fs.readdirSync(dir)) {
        const full = path.join(dir, f);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            walk(full, files);
        } else if (full.endsWith(".js")) {
            files.push(full);
        }
    }

    return files;
}

const gameFiles = walk(GAME_ROOT);

function stripComments(code) {
    return code
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
}

const importComponentsRegex =
    /import\s+(?:\{([^}]+)\}|([A-Za-z0-9_]+))\s+from\s+["']([^"']+)["']/g;


    for (const file of gameFiles) {
        const rawCode = fs.readFileSync(file, "utf8");
        const code = stripComments(rawCode);
    
        let match;
        while ((match = importComponentsRegex.exec(code))) {
    
            // import { A, B }
            const namedImports = match[1];
            // import A
            const defaultImport = match[2];
            const importPath = match[3];
    
            // gom component được import
            const importedComponents = [];
    
            if (namedImports) {
                namedImports
                    .split(",")
                    .map(s => s.trim().split(" as ")[0])
                    .forEach(c => importedComponents.push(c));
            }
    
            if (defaultImport) {
                importedComponents.push(defaultImport);
            }
    
            // kiểm tra từng component
            for (const component of importedComponents) {
                if (!disabledComponents.has(component)) continue;
    
                const moduleName = disabledComponents.get(component);
    
                process.stderr.write(`
=============================================================
    [⚠️  BUILD WARNING - MISSING SYSTEM ]
    Component '${component}' thuộc module '${moduleName}'
    nhưng module này đã bị DISABLE.
    👉 Hãy bật module này nếu muốn sử dụng Component.
    
    File: ${file}
=============================================================
    `);
            }
        }
    }
    