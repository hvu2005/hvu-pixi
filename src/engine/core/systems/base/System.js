import { world } from "engine/core/World";


export class System {
    constructor() {
        world.addSystem(this);
    }

    async init() {
        
    }
    
    update(dt) {
        
    }

    static _instances = new Map();

    /**
     * @template T
     * @param {new (...args:any[]) => T} SystemClass 
     * @returns {T}
     */
    static of(SystemClass) {
        if (!this._instances.has(SystemClass)) {
            this._instances.set(SystemClass, new SystemClass());
        }
        return this._instances.get(SystemClass);
    }
}