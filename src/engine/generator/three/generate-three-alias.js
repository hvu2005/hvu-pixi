import fs from "fs";
import * as THREE from "three";

// 🧩 Lấy toàn bộ key export từ three
const keys = Object.keys(THREE);

// 🧩 Cấu hình số export mỗi dòng (để dễ đọc)
const chunkSize = 1;
let formattedExports = [];

for (let i = 0; i < keys.length; i += chunkSize) {
  const chunk = keys.slice(i, i + chunkSize).join(", ");
  formattedExports.push(`  ${chunk}`);
}

// 🧩 Tạo block export có xuống dòng
let exportContent = `export {\n${formattedExports.join(",\n")}\n} from 'three';\n`;

// 🧩 Thêm GLTFLoader từ three-stdlib
exportContent += `export { GLTFLoader } from 'three-stdlib';\n`;

// 🧩 Đảm bảo thư mục tồn tại
fs.mkdirSync("src/engine", { recursive: true });

// 🧩 Ghi file alias
const outputPath = "src/engine/three.alias.js";
fs.writeFileSync(outputPath, exportContent, "utf8");

console.log(`✅ Generated ${outputPath} with ${keys.length + 1} named exports (including GLTFLoader).`);
