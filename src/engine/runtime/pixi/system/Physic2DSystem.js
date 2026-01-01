import { System } from "engine/core/system/base/System";
import { Collider2D } from "../component/Collider2D";
import { Engine, World, Events } from "matter-js";
import { Graphics } from "pixi.js";


export class Physic2DSystem extends System {
    constructor(world) {
        super(world, [Collider2D]);

        this.stage = world.pixi.stage;

        /**
         * @type {Collider2D[]}
         */
        this.components = [];

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
                const a = pair.bodyA;
                const b = pair.bodyB;
                // console.log("Collision:", a.id, b.id);
            }
        });
    }

    syncTransforms() {
        for (const component of this.components) {
            const transform = component.gameObject.transform;
            const body = component.getNode();
            transform.position.set(body.position.x, body.position.y);
            transform.rotation.set(body.angle);
        }
    }

    update(dt) {
        Engine.update(this.engine, dt * 1000);
        this.drawDebug();
        this.syncTransforms();
    }

    /**
     * @param {Collider2D} component
     */
    onComponentAdded(component) {
        World.add(this.engine.world, component.getNode());
        this.components.push(component);
    }

    /**
     * @param {Collider2D} component
     */
    onComponentRemoved(component) {
        World.remove(this.engine.world, component.getNode());
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
        g.clear();

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
