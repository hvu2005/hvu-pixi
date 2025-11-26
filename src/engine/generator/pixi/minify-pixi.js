import fs from "fs";
import { execSync } from "child_process";

const ROLLUP_FILE = "rollup.config.js";

// 🧩 Cấu hình Rollup tối ưu, an toàn cho PixiJS
const rollupConfig = `
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/engine/pixi.alias.strip.js",
  output: {
    file: "src/engine/pixi.alias.min.js",
    format: "esm",
    sourcemap: false,
    inlineDynamicImports: true
  },
  plugins: [
    resolve(),
    commonjs(),
    terser({
      compress: {
        passes: 2,               // chạy 2 vòng tối ưu
        pure_getters: true,
        drop_console: true,      // bỏ log / warn
        dead_code: true,
        conditionals: true,
        collapse_vars: true,
        reduce_vars: true,
      },
      mangle: {
        module: true,
        // ⚠️ giữ nguyên tên class / hàm để tránh lỗi runtime (Pixi dùng nhiều defineProperty)
        keep_classnames: true,
        keep_fnames: true,
      },
      format: {
        ecma: 2020,
        comments: false,
      },
    }),
  ],
  treeshake: {
    moduleSideEffects: false,
    preset: "smallest",
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
};
`;

// 🧩 Ghi file Rollup config tạm
fs.writeFileSync(ROLLUP_FILE, rollupConfig, "utf8");

console.log("🚀 Building safe & optimized PIXI alias...");

// 🧩 Thực thi Rollup
execSync("npx rollup -c", { stdio: "inherit" });

console.log("✅ Done! Output: src/engine/pixi.alias.min.js");

// 🧩 Xoá file cấu hình tạm
fs.unlinkSync(ROLLUP_FILE);
