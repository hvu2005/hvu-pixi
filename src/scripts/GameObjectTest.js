import { Asset } from "engine/asset/AssetLoader";
import { MonoBehaviour } from "engine/runtime/behaviour/MonoBehaviour";
import { instantiate } from "engine/runtime/instantiate";
import { SpriteRenderer } from "engine/runtime/pixi/component/SpriteRenderer";
import { GameObject2D } from "engine/runtime/pixi/entity/GameObject2D";


export function GameObjectTest() {
    const gameObject = instantiate(GameObject2D);
    gameObject.addComponent(new BehaviourTest());
    gameObject.addComponent(new SpriteRenderer(Asset.ITEM));
    gameObject.transform.position.set(450, 550);
    gameObject.transform.scale.set(2);
    
    return gameObject;
}

export class BehaviourTest extends MonoBehaviour {
    awake() {
    }

    start() {
    }

    update(dt) {
        this.gameObject.transform.rotation += 1*dt;
    }
}