import Matter, { Engine, World, Bodies, Events } from 'matter-js';
import { Graphics } from '@pixi.alias';
import { Body } from 'matter-js';
import { PostSystem } from '../base/PostSystem';
import { appEngine } from 'engine/core/runtime/AppEngine';



export class CollisionManager extends PostSystem {

    constructor() {
        super();
        // Khởi tạo Matter.js 
        // Engine và World
        this.engine = Engine.create();
        this.engine.gravity.x = 0;
        this.engine.gravity.y = 1;
        this.world = this.engine.world;
        this.colliders = []; // Danh sách collider đã đăng ký
        this._isPhysicsPaused = false;

        this.isDebugging = false;
    }

    get gravity() {
        return this.engine.gravity;
    }

    set gravity(gravity) {
        this.engine.gravity.x = gravity.x;
        this.engine.gravity.y = gravity.y;
    }

    get debug() {
        return this.isDebugging
    }

    set debug(bool) {
        this.isDebugging = bool;
        if (!bool)
            this.debugGraphics.clear();
    }

    get sleep() {
        return this._isPhysicsPaused;
    }

    set sleep(value) {
        for (const body of this.world.bodies) {
            Matter.Sleeping.set(body, true);
        }
        this._isPhysicsPaused = value;
    }

    async init() {

        //debug
        this.debugGraphics = new Graphics();
        this.debugGraphics.zIndex = 0;
        console.log(appEngine.pixi.stage);
        appEngine.pixi.stage.addChild(this.debugGraphics);
        // app.ticker.add(() => {
        //     const elapsedMS = app.ticker.deltaMS;
        //     this.update(elapsedMS);
        // });
        Events.on(this.engine, 'collisionStart', (event) => {
            for (const pair of event.pairs) {

                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;

                const colliderA = bodyA.collider;
                const colliderB = bodyB.collider;

                colliderA?.onTriggerEnter?.(colliderB);
                colliderB?.onTriggerEnter?.(colliderA);
            }
        });
    }

    // Đăng ký một collider vào CollisionManager
    registerCollider(body) {
        // colliderInstance phải tự tạo body trong _createBody()
        const b = body;

        if (!body) {
            console.warn("⚠️ Collider chưa có body hợp lệ:");
            return;
        }

        // Thêm body vào world nếu chưa có
        if (!this.world.bodies.includes(b)) {
            World.add(this.world, b);
        }

        this.colliders.push(b);
        return b;
    }


    // Xử lý va chạm giữa các đối tượng
    onCollision(pair) {
        const { bodyA, bodyB } = pair;
        const gameObjectA = bodyA.gameObject;
        const gameObjectB = bodyB.gameObject;

        if (gameObjectA && gameObjectA.onCollision) {
            gameObjectA.onCollision(gameObjectB);
        }
        if (gameObjectB && gameObjectB.onCollision) {
            gameObjectB.onCollision(gameObjectA);
        }
    }

    onTriggerEnter(pair) {
        const { bodyA, bodyB } = pair;
        const gameObjectA = bodyA.gameObject;
        const gameObjectB = bodyB.gameObject;

        if (gameObjectA && gameObjectA.onTriggerEnter) {
            gameObjectA.onTriggerEnter(gameObjectB);
        }
        if (gameObjectB && gameObjectB.onTriggerEnter) {
            gameObjectB.onTriggerEnter(gameObjectA);
        }
    }

    // Cập nhật engine Matter.js
    update(delta) {
        // Cập nhật Matter.js engine
        const deltaMs = delta * 100; // delta từ giây → ms
        Engine.update(this.engine);

        if (this.isDebugging) {
            this.onDebug();
        }
    }

    // Gỡ bỏ collider khỏi world
    unregisterCollider(gameObject) {
        const body = gameObject.body;
        World.remove(this.world, body);
        this.colliders = this.colliders.filter(collider => collider !== body);
    }

    // Cập nhật vị trí của collider
    updateColliderPosition(body, gameObject) {
        // if (gameObject.isSensor) return;
        // Tìm body liên kết với gameObject và cập nhật vị trí
        const global = gameObject.getGlobalPosition();
        if (body) {
            Body.setPosition(body, { x: global.x + body.offsetX, y: global.y + body.offsetY });
            Body.setAngle(body, gameObject.rotation);
        }
    }

    // updateColliderSize(gameObject, width, height) {
    //     const body = gameObject.body;

    //     if (!body) return;

    //     // Gỡ body cũ khỏi world
    //     World.remove(this.world, body);
    //     this.colliders = this.colliders.filter(c => c !== body);

    //     // Lấy vị trí và góc quay hiện tại để khôi phục
    //     const position = body.position;
    //     const angle = body.angle;
    //     const label = body.label;
    //     const isStatic = body.isStatic;
    //     const isSensor = body.isSensor;

    //     // Tạo body mới với kích thước mới
    //     const newBody = Bodies.rectangle(position.x, position.y, width, height, {
    //         isStatic,
    //         isSensor,
    //         label
    //     });

    //     newBody.gameObject = gameObject;
    //     gameObject.body = newBody;

    //     // Thêm body mới vào world và danh sách
    //     World.add(this.world, newBody);
    //     this.colliders.push(newBody);

    // }

    onDebug() {
        if (!this.debugGraphics) return;

        // Xóa khung debug cũ
        this.debugGraphics.clear();

        for (const body of this.colliders) {
            const verts = body.vertices;
            if (!verts || verts.length === 0) continue;

            // Bắt đầu vẽ polygon
            this.debugGraphics
                .stroke({ width: 2, color: 0xff0000, alpha: 1 })  // outline đỏ
                .fill({ color: 0xff0000, alpha: 0.2 });            // nền mờ đỏ

            // Đỉnh đầu tiên
            const first = this.debugGraphics.parent.toLocal({ x: verts[0].x, y: verts[0].y });
            this.debugGraphics.moveTo(first.x, first.y);

            // Các đỉnh tiếp theo
            for (let i = 1; i < verts.length; i++) {
                const v = verts[i];
                const local = this.debugGraphics.parent.toLocal({ x: v.x, y: v.y });
                this.debugGraphics.lineTo(local.x, local.y);
            }

            // Đóng path và vẽ
            this.debugGraphics.closePath().fill().stroke();
        }
    }


}


export const collisionManager = new CollisionManager();
