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
        console.log("EntityTest awake");
    }

    start() {
        console.log(this.entity.get(SpriteRenderer));
        this.transform.scale.set(2, 2);
    }

    update(dt) {
        console.log("EntityTest update");
    }
}