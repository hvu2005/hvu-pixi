import { Asset } from "engine/asset/AssetLoader";
import { Behaviour } from "engine/core/components/behaviour/Behaviour";
import { SpriteRenderer } from "engine/core/components/renderer/SpriteRenderer";
import { Entity2D } from "engine/core/entities/Entity2D";

export function createEntityTest() {
    const entity = new Entity2D();
    entity.add(new EntityTest());
    entity.add(new SpriteRenderer(Asset.ITEM));
    entity.transform.position.set(150, 250);

    return entity;
}

class EntityTest extends Behaviour {
    awake() {

    }

    start() {
        this.eventMode = "static";
        console.log(this.entity.get(SpriteRenderer));
        this.transform.scale.set(1, 1);
    }

    update(dt) {

    }

    onPointerDown(event) {
        console.log("vcl down");
    }

    onPointerUp(event) {
        console.log("vcl up");
    }

    onPointerMove(event) {
        // // Lấy vị trí chuột từ event (Pixi.js v8)
        // const globalPos = event.data?.global || event.global;
        
        // // Di chuyển entity theo vị trí chuột
        // this.transform.position.set(globalPos.x, globalPos.y);
        console.log("vcl move");
    }

    onPointerOver(event) {
        console.log("vcl over");
    }
}