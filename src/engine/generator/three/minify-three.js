import fs from "fs";
import { execSync } from "child_process";

const ROLLUP_FILE = "rollup.config.js";

// 🧩 Cấu hình Rollup cho three.alias.strip.js
const rollupConfig = `
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { threeMinifier } from "@yushijinhun/three-minifier-rollup";

export default {
  input: "src/engine/three.alias.strip.js",
  output: {
    file: "src/engine/three.alias.min.js",
    format: "esm",
    sourcemap: false,
    inlineDynamicImports: true
  },
  plugins: [threeMinifier({ global: false }),resolve(), commonjs(), terser()],
  treeshake: {
    moduleSideEffects: false,
    preset: "smallest",
  },
};
`;

// 🧩 Ghi file tạm
fs.writeFileSync(ROLLUP_FILE, rollupConfig, "utf8");

console.log("🚀 Building minified THREE alias...");
execSync("npx rollup -c", { stdio: "inherit" });

console.log("✅ Done! Output: src/engine/three.alias.min.js");

// 🧩 Xóa file rollup tạm
fs.unlinkSync(ROLLUP_FILE);
