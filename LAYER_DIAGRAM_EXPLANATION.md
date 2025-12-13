# Giải thích Sơ đồ Layer - Đúng hay Sai?

## Sơ đồ của bạn

```
Entity → Components → System → World → App (pixi, three)
```

## Phân tích

### ✅ **ĐÚNG** nếu hiểu theo nghĩa **"Dependency"** (Phụ thuộc):

1. **Component → Entity**: Component phụ thuộc Entity (Component có reference `this.entity`)
2. **Entity → System**: Entity/Components phụ thuộc System (Components đăng ký với Systems)
3. **System → World**: System phụ thuộc World (System tự động đăng ký với World trong constructor)
4. **World → App**: World phụ thuộc App (World được khởi tạo bởi App)

### ❌ **SAI** nếu hiểu theo nghĩa **"Contains"** hoặc **"Manages"**:

Nếu hiểu theo nghĩa "chứa" hoặc "quản lý", thứ tự đúng phải là:

```
App → World → System → Entity → Component
```

Vì:
- App **khởi tạo** World
- World **quản lý** Systems
- System **xử lý** Entities/Components
- Entity **chứa** Components

## Mối quan hệ thực tế trong code

### 1. Component → Entity (Component phụ thuộc Entity)
```javascript
// Component.js
create(entity) {
    this.entity = entity;  // Component có reference đến Entity
}
```

### 2. Component → System (Component đăng ký với System)
```javascript
// Behaviour.js
async init() {
    behaviourSystem.addBehaviour(this);  // Component đăng ký với System
}
```

### 3. System → World (System tự đăng ký với World)
```javascript
// System.js
constructor() {
    world.addSystem(this);  // System tự động đăng ký với World
}
```

### 4. App → World (App khởi tạo World)
```javascript
// index.js
async function startGame() {
    await init({pixi: pixi});  // App khởi tạo World
}
```

## Kết luận

**Sơ đồ của bạn ĐÚNG** nếu:
- Mũi tên thể hiện **"dependency"** (phụ thuộc)
- Mũi tên đi từ **dưới lên trên** nghĩa là lớp dưới phụ thuộc vào lớp trên

**Sơ đồ của bạn SAI** nếu:
- Mũi tên thể hiện **"contains"** hoặc **"manages"**
- Cần đảo ngược thứ tự

## Sơ đồ PlantText đã chỉnh sửa

Xem file `LAYER_DIAGRAM_CORRECTED.puml` để có sơ đồ rõ ràng hơn với cả hai cách hiểu.

## Khuyến nghị

Để rõ ràng hơn, nên ghi chú trên mũi tên:
- "depends on" / "uses" - nếu là dependency
- "contains" / "manages" - nếu là ownership

Hoặc vẽ 2 loại mũi tên khác nhau để phân biệt.


