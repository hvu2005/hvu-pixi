import { Asset } from "engine/asset/AssetLoader";
import { Behaviour } from "engine/core/components/behaviour/Behaviour";
import { BoxCollider2D } from "engine/core/components/physic/BoxCollider2D";
import { SpriteRenderer } from "engine/core/components/renderer/SpriteRenderer";
import { Entity2D } from "engine/core/entities/Entity2D";

export function createEntityTest() {
    const entity = new Entity2D();
    entity.add(new EntityTest());
    entity.add(new SpriteRenderer(Asset.ITEM));
    entity.add(new BoxCollider2D({ width: 250, height: 250 }));
    entity.transform.position.set(150, 250);

    return entity;
}

class EntityTest extends Behaviour {
    awake() {

    }

    start() {
        this.eventMode = "static";
        console.log(this.entity.get(SpriteRenderer));
        this.transform.scale.set(0.5, 0.5);
    }

    update(dt) {

    }

    onPointerDown(event) {

    }

    onPointerUp(event) {

    }

    onPointerMove(event) {
        // Lấy vị trí chuột từ event (Pixi.js v8)
        const globalPos = event.data?.global || event.global;

        // Di chuyển entity theo vị trí chuột
        this.transform.position.set(globalPos.x, globalPos.y);

    }

    onPointerOver(event) {

    }

    onCollisionEnter(collision) {
        console.log("onCollisionEnter", collision);
    }
}