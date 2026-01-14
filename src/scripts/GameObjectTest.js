
import { MonoBehaviour, instantiate, Collider2D, RenderOrder2D, SpriteRenderer, GameObject2D } from "engine";
import { Asset } from "./AssetLoader";


export function GameObjectTest() {
    const gameObject = instantiate(GameObject2D, {renderOrder: 1, tag: "GameObjectTest"});
    gameObject.addComponent(new BehaviourTest());   
    gameObject.addComponent(new SpriteRenderer(Asset.ITEM));
    gameObject.addComponent(new Collider2D({isStatic: true, isSensor: true}));    
    gameObject.transform.position.set(450, 1150, 0);
    gameObject.transform.scale.set(1);


    const child1 = instantiate(GameObject2D);
    child1.addComponent(new SpriteRenderer(Asset.ITEM));
    child1.transform.position.set(0, 0, 0);
    child1.transform.scale.set(0.5);
    gameObject.transform.addChild(child1.transform);

    return gameObject;
}


export class BehaviourTest extends MonoBehaviour {
    awake() {
        this.time = 0;
    }

    start() {
        this.collider = this.gameObject.getComponent(Collider2D);
        this.collider.on(Collider2D.COLLISION_ENTER, this.onCollisionEnter.bind(this));

        this.renderOrder = this.gameObject.getComponent(RenderOrder2D);
        this.renderOrder.order = 0;
    }

    update(dt) {
        // this.time += dt;
        // if (this.time >= 3) {
        //     console.log("3 seconds passed");
        //     this.gameObject.transform.position.set(450, 0, 0);
        //     this.time = 0;
        // }
        // this.gameObject.transform.rotation.z += 1 * dt;  
    }

    onCollisionEnter(other) {
        console.log("onCollisionEnter", other.gameObject);
    }
    
}