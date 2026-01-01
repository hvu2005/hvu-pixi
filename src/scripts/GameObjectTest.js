import { Asset } from "engine/asset/AssetLoader";
import { MonoBehaviour } from "engine/runtime/behaviour/MonoBehaviour";
import { instantiate } from "engine/runtime/instantiate";
import { Collider2D } from "engine/runtime/pixi/component/Collider2D";
import { SpriteRenderer } from "engine/runtime/pixi/component/SpriteRenderer";
import { GameObject2D } from "engine/runtime/pixi/entity/GameObject2D";


export function GameObjectTest() {
    const gameObject = instantiate(GameObject2D);
    gameObject.addComponent(new BehaviourTest());
    gameObject.addComponent(new SpriteRenderer(Asset.ITEM));
    gameObject.addComponent(new Collider2D());
    gameObject.transform.position.set(450, 450);
    gameObject.transform.scale.set(2);

    const child1 = instantiate(GameObject2D);
    child1.addComponent(new SpriteRenderer(Asset.ITEM));
    child1.transform.position.set(0, 0);
    child1.transform.scale.set(0.5);
    gameObject.transform.addChild(child1.transform);

    return gameObject;
}


export class BehaviourTest extends MonoBehaviour {
    awake() {
    }

    start() {
    }

    update(dt) {
        this.gameObject.transform.rotation.z += 1 * dt;
    }
}