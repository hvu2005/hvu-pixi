
import {LineBasicMaterial, Group, EdgesGeometry, LineSegments, CylinderGeometry, SphereGeometry, BoxGeometry} from '@three.alias';

import { PostSystem } from '../base/PostSystem';
import { appEngine } from 'engine/core/runtime/AppEngine';
import { Body, Box, Cylinder, Material, NaiveBroadphase, Shape, Sphere, Vec3, World } from 'cannon-es';


export const Collider3DShape = Object.freeze({
    Box: 'box',
    Sphere: 'sphere',
    Cylinder: 'cylinder',
});


export class Collision3DManager extends PostSystem {

    constructor() {
        super();

        // 🌍 Thế giới vật lý Cannon
        this.world = new World();
        this.world.gravity.set(0, -9, 0);
        this.world.broadphase = new NaiveBroadphase();
        this.world.solver.iterations = 10;

        this.colliders = [];
        this.isPhysicsPaused = false;
        this.debugEnabled = false;
        this.previousContacts = new Set();

        // 🔹 Debug vật lý 3D
        this._debugMeshes = new Map();
        this._debugMaterial = new LineBasicMaterial({ color: 0x00ff00 });
    }

    get gravity() {
        return this.world.gravity;
    }

    set gravity(gravity) {
        this.world.gravity.set(gravity.x, gravity.y, gravity.z);
    }

    get debug() {
        return this.debugEnabled;
    }

    set debug(value) {
        this.debugEnabled = value;
        if (!value) this._clearDebugMeshes();
    }

    registerCollider(colliderInstance, options = {}) {
        const {
            offset = { x: 0, y: 0, z: 0 }, // 🟢 offset tương đối với gameObject
            width = 1,
            height = 1,
            depth = 1,
            radius = 0.5,
            shapeType = 'box',
            isStatic = false,
            isSensor = true,
            label = 'none',

            // 🟢 Các tham số mở rộng
            mass = isStatic ? 0 : 1,
            friction = 0.3,
            restitution = 0.2,
            linearDamping = 0.01,
            angularDamping = 0.01,
            materialName = `${label}_mat`,
            ...extraParams // 🟡 cho phép truyền thêm bất cứ param nào
        } = options;

        // 🧱 Tạo shape
        let shape;
        switch (shapeType) {
            case Collider3DShape.Sphere:
                shape = new Sphere(radius);
                break;
            case Collider3DShape.Cylinder:
                shape = new Cylinder(radius, radius, height, 12);
                break;
            case Collider3DShape.Box:
            default:
                shape = new Box(new Vec3(width / 2, height / 2, depth / 2));
                break;
        }

        // 🧩 Tạo material riêng cho body (có thể tái sử dụng)
        const material = new Material(materialName);
        material.restitution = restitution; // độ nảy
        material.friction = friction;      // ma sát

        // ⚙️ Tạo body cơ bản
        const body = new Body({
            mass,
            type: isStatic ? Body.STATIC : Body.DYNAMIC,
            material,
            linearDamping,
            angularDamping,
            ...extraParams,
        });

        // 🟣 Thêm shape vào body với offset (rất quan trọng)
        const offsetVec = new Vec3(offset.x, offset.y, offset.z);
        body.addShape(shape, offsetVec); // <—— offset shape tại đây!

        // 🔹 Metadata
        body.collider = colliderInstance;
        body.label = label;
        body.isSensor = isSensor;
        if (isSensor) body.collisionResponse = false;

        // Thêm vào world
        this.world.addBody(body);
        this.colliders.push(body);

        return body;
    }

    unregisterCollider(colliderInstance) {
        const body = colliderInstance.body;
        if (body) {
            this.world.removeBody(body);
            this.colliders = this.colliders.filter(b => b !== body);
            this._removeDebugMesh(body.id);
        }
    }

    // 🧠 Update vật lý + debug
    update(delta) {
        if (this.isPhysicsPaused) return;

        const fixedTimeStep = 1 / 60;
        this.world.step(fixedTimeStep, delta, 3);

        this._handleCollisions();

        if (this.debugEnabled) this._updateDebugMeshes();
    }

    // 🔸 Cập nhật vị trí collider
    updateColliderPosition(body, gameObject) {

        const pos = gameObject.position;
        const rot = gameObject.rotation;
        if (!body) return;

        body.position.set(pos.x, pos.y, pos.z);
        body.quaternion.setFromEuler(rot.x, rot.y, rot.z, 'XYZ');
    }

    // 🔶 Quản lý collision trigger
    _handleCollisions() {
        const contactsNow = new Set();
        const processedPairs = new Set();

        // ✅ Duyệt tất cả contact hiện có
        for (let i = 0; i < this.world.contacts.length; i++) {
            const contact = this.world.contacts[i];
            const bi = contact.bi;
            const bj = contact.bj;
            if (!bi || !bj) continue;

            const key = bi.id < bj.id ? `${bi.id}-${bj.id}` : `${bj.id}-${bi.id}`;
            if (processedPairs.has(key)) continue;
            processedPairs.add(key);

            contactsNow.add(key);

            const a = bi.collider;
            const b = bj.collider;

            // 🟢 Mới chạm nhau → Enter
            if (!this.previousContacts.has(key)) {
                a?.onTriggerEnter?.(b);
                b?.onTriggerEnter?.(a);
            }
            // 🟡 Đang tiếp xúc liên tục → Stay
            else {
                a?.onTriggerStay?.(b);
                b?.onTriggerStay?.(a);
            }
        }

        // 🔴 Xử lý các contact đã biến mất → Exit
        for (const key of this.previousContacts) {
            if (!contactsNow.has(key)) {
                // Tách lại id để lấy collider
                const [idA, idB] = key.split('-').map(Number);
                const a = this.world.bodies.find(b => b.id === idA)?.collider;
                const b = this.world.bodies.find(b => b.id === idB)?.collider;
                if (a && b) {
                    a?.onTriggerExit?.(b);
                    b?.onTriggerExit?.(a);
                }
            }
        }

        // Cập nhật state frame hiện tại
        this.previousContacts = contactsNow;
    }


    // 🟩 Debug 3D: Cập nhật collider mesh
    _updateDebugMeshes() {
        const bodies = this.world.bodies;

        // Ẩn mesh cũ
        for (const mesh of this._debugMeshes.values()) mesh.visible = false;

        for (const body of bodies) {
            if (!body.shapes.length) continue;

            let group = this._debugMeshes.get(body.id);
            if (!group) {
                // 🔹 Tạo group chứa nhiều shape (vì body có thể có nhiều collider)
                group = new Group();
                group.name = `BodyDebug_${body.id}`;
                appEngine.three.scene.add(group);
                this._debugMeshes.set(body.id, group);

                // Tạo mesh debug cho từng shape trong body
                for (let i = 0; i < body.shapes.length; i++) {
                    const shape = body.shapes[i];
                    const mesh = this._createDebugMeshForShape(shape, body);
                    if (mesh) group.add(mesh);
                }
            }

            // 🔹 Cập nhật transform group theo body
            group.visible = true;
            group.position.copy(body.position);
            group.quaternion.copy(body.quaternion);
        }
    }

    _createDebugMeshForShape(shape, body) {
        let geometry;

        switch (shape.type) {
            case Shape.types.BOX: {
                const size = shape.halfExtents;
                geometry = new BoxGeometry(size.x * 2, size.y * 2, size.z * 2);
                break;
            }
            case Shape.types.SPHERE:
                geometry = new SphereGeometry(shape.radius, 8, 8);
                break;
            case Shape.types.CYLINDER:
                geometry = new CylinderGeometry(
                    shape.radiusTop || 0.5,
                    shape.radiusBottom || 0.5,
                    shape.height || 1,
                    8
                );
                break;
            default:
                console.warn('Unsupported shape type:', shape.type);
                return null;
        }

        const edges = new EdgesGeometry(geometry);
        const wire = new LineSegments(edges, this._debugMaterial);

        // 🟪 Đặt tên để dễ tìm trong scene
        wire.name = `ColliderShape_${shape.type}_${body.id}`;

        // 🔹 Lấy offset của shape trong body
        const offset = body.shapeOffsets?.[body.shapes.indexOf(shape)];
        const orientation = body.shapeOrientations?.[body.shapes.indexOf(shape)];

        // ✅ Áp dụng offset & rotation riêng cho shape
        if (offset) wire.position.copy(offset);
        if (orientation) wire.quaternion.copy(orientation);

        // 🎨 Màu riêng theo loại body
        if (body.isSensor) wire.material = new LineBasicMaterial({ color: 0xff00ff });
        else if (body.mass === 0) wire.material = new LineBasicMaterial({ color: 0x00ffff });
        else wire.material = new LineBasicMaterial({ color: 0x00ff00 });

        return wire;
    }

    _removeDebugMesh(id) {
        const mesh = this._debugMeshes.get(id);
        if (mesh) {
            appEngine.three.scene.remove(mesh);
            this._debugMeshes.delete(id);
        }
    }

    _clearDebugMeshes() {
        for (const mesh of this._debugMeshes.values()) {
            appEngine.three.scene.remove(mesh);
        }
        this._debugMeshes.clear();
    }

    pausePhysics() {
        this.isPhysicsPaused = true;
    }

    resumePhysics() {
        this.isPhysicsPaused = false;
    }
}

export const collision3DManager = new Collision3DManager();
