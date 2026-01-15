import fs from "fs";
import path from "path";

const watchDir = path.resolve("src/assets");
const output = path.resolve("src/engine/alias/auto-asset.js");

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
    let name = path
      .basename(file, path.extname(file))
      .replace(/[^a-zA-Z0-9_$]/g, "_");
  
    // Nếu bắt đầu bằng số → thêm _
    if (/^[0-9]/.test(name)) {
      name = "_" + name;
    }
  
    return name;
  }

// Chuyển đường dẫn tuyệt đối thành tương đối (từ thư mục src)
function toRelativePath(fullPath) {
  return "assets/" + path.relative("src/assets", fullPath).replace(/\\/g, "/");
}

function generate() {
  const allFiles = getAllFiles(watchDir).filter(f =>
    /\.(png|jpg|jpeg|gif|webp|svg|glb|json)$/i.test(f)
  );

  const exports = allFiles.map(file => {
    const key = toKeyName(file);         // Ví dụ: "ITEM_AS_6"
    const relPath = toRelativePath(file); // Ví dụ: "../../../assets/Items/AS_6.png"
    return `export { default as ${key} } from "${relPath}";`;
  });

  const outputCode = `// ⚙️ Auto-generated file — DO NOT EDIT MANUALLY
${exports.join("\n")}
`;

  fs.writeFileSync(output, outputCode);
  console.log(`✅ Updated autoAssets.js (${exports.length} exports)`);
}


generate();

// Watcher theo dõi thay đổi file
fs.watch(watchDir, { recursive: true }, (_, filename) => {
  if (filename && /\.(png|jpg|jpeg|gif|webp|svg|glb|json)$/i.test(filename)) {
    console.log(`🌀 Change detected: ${filename}`);
    generate();
  }
});
