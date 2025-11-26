import fs from "fs";
import * as PIXI from "pixi.js";

// 🧩 Lấy toàn bộ key export từ pixi.js
const keys = Object.keys(PIXI);

// 🧩 Chia thành nhiều dòng để dễ đọc
const chunkSize = 1; // số export mỗi dòng
let formattedExports = [];

for (let i = 0; i < keys.length; i += chunkSize) {
  const chunk = keys.slice(i, i + chunkSize).join(", ");
  formattedExports.push(`  ${chunk}`);
}

// 🧩 Tạo nội dung có xuống dòng đẹp
const exportBlock = `export {\n${formattedExports.join(",\n")}\n} from 'pixi.js';\n`;

// 🧩 Đảm bảo thư mục tồn tại
fs.mkdirSync("src/engine", { recursive: true });

// 🧩 Ghi file alias
const outputPath = "src/engine/pixi.alias.js";
fs.writeFileSync(outputPath, exportBlock, "utf8");

console.log(`✅ Generated ${outputPath} with ${keys.length} named exports.`);
