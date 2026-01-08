import { worldContext } from "engine/runtime/world-context";


export class Collider2DGizmos {
    constructor() {
        this.physic2DSystem = worldContext.current.getSystem(Physic2DSystem);
        this.components = this.physic2DSystem.components;
    }
}