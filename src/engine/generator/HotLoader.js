import fs from "fs";
import path from "path";

const watchDir = path.resolve("src/assets");
const output = path.resolve("src/engine/autoAssets.js");

// Hàm đệ quy để lấy toàn bộ file trong thư mục con
function getAllFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? getAllFiles(fullPath) : [fullPath];
  });
}

// Chuyển tên file thành key hợp lệ
function toKeyName(file) {
  return path.basename(file, path.extname(file)).replace(/[^a-zA-Z0-9_$]/g, "_");
}

// Chuyển đường dẫn tuyệt đối thành tương đối (từ thư mục src)
function toRelativePath(fullPath) {
  return "assets/" + path.relative("src/assets", fullPath).replace(/\\/g, "/");
}

function generate() {
  const allFiles = getAllFiles(watchDir).filter(f => /\.(png|jpg|jpeg|gif|webp|svg|glb)$/i.test(f));

  const entries = allFiles.map(file => {
    const key = toKeyName(file);
    const relPath = toRelativePath(file);
    return `  ${key}: "${relPath}"`;
  });

  const outputCode = `// ⚙️ Auto-generated file — DO NOT EDIT MANUALLY
export default {
${entries.join(",\n")}
};`;

  fs.writeFileSync(output, outputCode);
  console.log(`✅ Updated autoAssets.js (${entries.length} assets)`);
}

generate();

// Watcher theo dõi thay đổi file
fs.watch(watchDir, { recursive: true }, (_, filename) => {
  if (filename && /\.(png|jpg|jpeg|gif|webp|svg|glb)$/i.test(filename)) {
    console.log(`🌀 Change detected: ${filename}`);
    generate();
  }
});
