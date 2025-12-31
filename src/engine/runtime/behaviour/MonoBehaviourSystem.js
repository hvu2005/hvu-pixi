import { System } from "engine/core/system/base/System";
import { MonoBehaviour } from "./MonoBehaviour";






export class MonoBehaviourSystem extends System {
    constructor(world) {
        super(world, [MonoBehaviour]);

        /**
         * @type {MonoBehaviour[]}
         */
        this.monoBehaviours = [];
        /**
         * @type {MonoBehaviour[]}
         */
        this.startQueue = [];
    }

    /**
     * 
     * @param {MonoBehaviour} component 
     */
    onComponentAdded(component) {
        this.monoBehaviours.push(component);
        this.startQueue.push(component);
    }

    /**
     * @param {MonoBehaviour} component 
     */
    onComponentRemoved(component) {
        this.monoBehaviours = this.monoBehaviours.filter(monoBehaviour => monoBehaviour !== component);
    }

    update(dt) {
        this.flushStartQueue();

        for (const monoBehaviour of this.monoBehaviours) {
            monoBehaviour.update(dt);
        }
    }

    flushStartQueue() {
        while (this.startQueue.length > 0) {
            const monoBehaviour = this.startQueue.pop();
            monoBehaviour.start();
        }
    }
}   