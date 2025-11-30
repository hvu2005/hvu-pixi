import { world } from "engine/core/World";


export class System {
    constructor() {
        world.addSystem(this);
    }

    async init() {
        
    }
    
    update(dt) {
        
    }
}