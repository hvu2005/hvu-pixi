# Layer Diagram - Core Architecture (Simplified)

## Tổng quan

Sơ đồ này chỉ tập trung vào **4 lớp trừu tượng cốt lõi** của game engine:

1. **World** - Điều phối toàn bộ
2. **System** - Xử lý logic
3. **Entity** - Container
4. **Component** - Chức năng

## Sơ đồ PlantUML

File: `LAYER_DIAGRAM_SIMPLE.puml`

Copy nội dung vào [planttext.com](https://www.planttext.com) để xem sơ đồ.

## Mô tả các lớp

### 1. World Layer (Lớp Điều phối)
- **Trách nhiệm**: Quản lý game loop, điều phối tất cả systems
- **Chức năng chính**:
  - Khởi tạo và quản lý systems
  - Chạy game loop (update/render)
  - Quản lý vòng đời của toàn bộ game

### 2. System Layer (Lớp Hệ thống)
- **Trách nhiệm**: Xử lý logic nghiệp vụ theo domain
- **Chức năng chính**:
  - Xử lý entities mỗi frame
  - Thực thi logic chuyên biệt (physics, behavior, rendering, etc.)
  - Đăng ký và quản lý components liên quan

### 3. Entity Layer (Lớp Thực thể)
- **Trách nhiệm**: Container chứa các components
- **Chức năng chính**:
  - Quản lý tập hợp components
  - Quản lý trạng thái active/inactive
  - Cung cấp lifecycle hooks

### 4. Component Layer (Lớp Component)
- **Trách nhiệm**: Mở rộng chức năng của entity
- **Chức năng chính**:
  - Cung cấp các tính năng cụ thể
  - Đăng ký với systems tương ứng
  - Quản lý lifecycle riêng

## Luồng hoạt động

```
World.init()
  ↓
World.addSystem(System)
  ↓
World.run() → Game Loop
  ↓
  World.update(dt)
    ↓
    System.update(dt)
      ↓
      System.process(Entity)
        ↓
        Entity.components
          ↓
          Component logic
```

## Mối quan hệ

```
World → System (1:N)
  - World quản lý nhiều Systems
  - World gọi System.update() mỗi frame

System → Entity (N:M)
  - System xử lý nhiều Entities
  - Entity có thể được xử lý bởi nhiều Systems

Entity → Component (1:N)
  - Entity chứa nhiều Components
  - Component thuộc về một Entity

Component → System (N:M)
  - Component đăng ký với Systems
  - System quản lý nhiều Components
```

## Design Pattern

Kiến trúc này tuân theo **Entity-Component-System (ECS)** pattern:

- **Entity**: Container rỗng, chỉ chứa ID và components
- **Component**: Dữ liệu thuần (data)
- **System**: Logic xử lý (behavior)

## Ưu điểm

1. **Tách biệt concerns**: Logic tách khỏi data
2. **Linh hoạt**: Dễ thêm/bớt components và systems
3. **Hiệu năng**: Systems xử lý theo batch
4. **Mở rộng**: Dễ thêm systems mới mà không ảnh hưởng code cũ


