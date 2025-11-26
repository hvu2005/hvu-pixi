import { Collider, MonoBehaviour } from "@engine";
import { Coroutine } from "engine/utils/utils.d";




export class Model2DTest extends MonoBehaviour{
    start() {
        this.collider = this.getComponent(Collider);
    }
    
    onTriggerEnter(other) {
        this.reset();
    }

    async reset() {
        await Coroutine.waitForSeconds(2);
        
        this.gameObject.position.set(400, 300);
        this.gameObject.rotation = Math.PI / 2;
        this.collider.body.velocity.y = 0;
    }


}