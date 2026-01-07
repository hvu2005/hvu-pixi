import { System } from "engine/core/system/base/system";
import { Collider2D } from "../component/collider-2d";
import { Engine, World, Events } from "matter-js";
import { Graphics } from "@pixi.alias";


export class Physic2DSystem extends System {
    /**
     * 
     * @param {import("engine/core/world").World} world 
     */
    constructor(world) {
        super(world, [Collider2D]);

        this.stage = world.renderContext.pixi.stage;
        this.fixedDt = 1 / 60;
        this.accumulator = 0;

        /**
         * @type {Collider2D[]}
         */
        this.components = [];

        /** @type {WeakMap<Matter.Body, Collider2D>} */
        this.bodyToCollider = new WeakMap();

        const stage = this.stage;

        this.engine = Engine.create({
            enableSleeping: true
        });

        // DEBUG DRAW
        this.debugGraphics = new Graphics();

        stage.addChild(this.debugGraphics);

        // collision events (để sẵn)
        Events.on(this.engine, "collisionStart", (event) => {
            for (const pair of event.pairs) {
                const colA = this.bodyToCollider.get(pair.bodyA);
                const colB = this.bodyToCollider.get(pair.bodyB);
        
                if (colA.enabled && colA.onCollisionEnter) {
                    colA.onCollisionEnter(colB);
                }
                if (colB.enabled && colB.onCollisionEnter) {
                    colB.onCollisionEnter(colA);
                }
            }
        });

        Events.on(this.engine, "collisionEnd", (event) => {
            for (const pair of event.pairs) {
                const colA = this.bodyToCollider.get(pair.bodyA);
                const colB = this.bodyToCollider.get(pair.bodyB);
        
                if (colA.enabled && colA.onCollisionExit) {
                    colA.onCollisionExit(colB);
                }
                if (colB.enabled && colB.onCollisionExit) {
                    colB.onCollisionExit(colA);
                }
            }
        });

        Events.on(this.engine, "collisionActive", (event) => {
            for (const pair of event.pairs) {
                const colA = this.bodyToCollider.get(pair.bodyA);
                const colB = this.bodyToCollider.get(pair.bodyB);
        
                if (colA.enabled && colA.onCollisionStay) {
                    colA.onCollisionStay(colB);
                }
                if (colB.enabled && colB.onCollisionStay) {
                    colB.onCollisionStay(colA);
                }
            }
        });
    }

    syncTransformsToPhysics() {
        for (const component of this.components) {
            const body = component.getNode();
            if (!component.enabled || body.isStatic) continue;
            const transform = component.gameObject.transform;
            transform._setPositionInternal(
                body.position.x,
                body.position.y,
                transform.position.z,
                false
            );
            transform._setRotationInternal(0, 0, body.angle, false);
        }
    }

    update(dt) {
        this.accumulator += dt;
    
        while (this.accumulator >= this.fixedDt) {
            Engine.update(this.engine, this.fixedDt * 1000);
            this.accumulator -= this.fixedDt;
        }
    
        this.syncTransformsToPhysics();
        this.drawDebug();
    }

    /**
     * @param {Collider2D} component
     */
    onComponentAdded(component) {
        const body = component.getNode();
        World.add(this.engine.world, body);
        this.bodyToCollider.set(body, component);
        this.components.push(component);
    }

    /**
     * @param {Collider2D} component
     */
    onComponentRemoved(component) {
        const body = component.getNode();
        World.remove(this.engine.world, body);
        this.bodyToCollider.delete(body);
        this.components = this.components.filter(c => c !== component);
    }


    drawDebug() {
        const g = this.debugGraphics;
        g.clear();

        for (const collider of this.components) {
            this.drawBody(g, collider.getNode());
        }
    }

    drawBody(g, body) {

        const verts = body.vertices;
        if (!verts || verts.length === 0) return;
        // Bắt đầu vẽ polygon
        g.stroke({ width: 2, color: 0x00ff00, alpha: 1 })  // outline xanh lá
            .fill({ color: 0x00ff00, alpha: 0 });            // nền mờ xanh lá

        // Đỉnh đầu tiên
        const first = g.parent.toLocal({ x: verts[0].x, y: verts[0].y });
        g.moveTo(first.x, first.y);

        // Các đỉnh tiếp theo
        for (let i = 1; i < verts.length; i++) {
            const v = verts[i];
            const local = this.debugGraphics.parent.toLocal({ x: v.x, y: v.y });
            this.debugGraphics.lineTo(local.x, local.y);
        }

        // Đóng path và vẽ
        g.closePath().fill().stroke();
    }


}
