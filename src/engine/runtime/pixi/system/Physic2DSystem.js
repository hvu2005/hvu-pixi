import { System } from "engine/core/system/base/System";
import { Collider2D } from "../component/Collider2D";




export class Physic2DSystem extends System {
    constructor(world) {
        super(world, [Collider2D]);

        
    }
}
