import { Body, Engine, Events, World } from "matter-js";
import { Graphics } from "@pixi.alias";
import { world } from "engine/core/World";
import { System } from "../base/System";


class Physic2DSystem extends System {
    async init() {
        console.log("Physic2DSystem init");
        this.engine = Engine.create();
        this.engine.gravity.y = 0;

        this.colliders = [];

        this.debugGraphics = new Graphics();
        this.debugGraphics.zIndex = 0;
        world.pixi.stage.addChild(this.debugGraphics);

        this._registEvents();
    }

    _registEvents() {
        Events.on(this.engine, "afterUpdate", () => this._syncTransform());

        Events.on(this.engine, 'collisionStart', (event) => {
            for (const pair of event.pairs) {
                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;

                const colliderA = bodyA.collider;
                const colliderB = bodyB.collider;

                colliderA?.onCollisionEnter?.(colliderB);
                colliderB?.onCollisionEnter?.(colliderA);
            }
        });
    }

    _syncTransform() {
        for(const collider of this.colliders) {
            const t = collider.entity.transform;
            const x = t.position.x + collider.options.x;
            const y = t.position.y + collider.options.y;


            Body.setPosition(collider.body, {x: x, y: y});
            Body.setAngle(collider.body, t.rotation);
            if(collider.currentScaleX != t.scale.x || collider.currentScaleY != t.scale.y) {
                collider.currentScaleX = t.scale.x;
                collider.currentScaleY = t.scale.y;
                Body.scale(collider.body, t.scale.x, t.scale.y);
            }
        }
    }

    update(dt) {
        Engine.update(this.engine);

        this.onDebug();
    }

    addCollider(collider) {
        const body = collider.body;
        body.collider = collider;
        
        World.add(this.engine.world, body);
        this.colliders.push(collider);
    }
    

    //#region DEBUG
    onDebug() {
        if (!this.debugGraphics) return;

        // Xóa khung debug cũ
        this.debugGraphics.clear();

        for (const c of this.colliders) {
            const body = c.body;
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

    //#endregion

}


export const physic2DSystem = new Physic2DSystem();