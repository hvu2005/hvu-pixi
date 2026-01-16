import { interestedComponent } from "engine/core/decorator/interested-component";
import { System } from "engine/core/system/base/system";
import { MeshAnimator } from "../component/mesh-animator";
import { executeOrder } from "engine/core/decorator/execute-order";


@executeOrder(9)
@interestedComponent(MeshAnimator)
export class MeshAnimatorSystem extends System {

    constructor(world) {
        super(world);

        /**
         * @type {MeshAnimator[]}
         */
        this.animators = [];

        /**
         * @type {MeshAnimator[]}
         */
        this.startQueue = [];
    }

    /**
     * 
     * @param {MeshAnimator} component 
     */
    onComponentAdded(component) {
        this.animators.push(component);
        this.startQueue.push(component);
    }

    /**
     * 
     * @param {MeshAnimator} component 
     */
    onComponentRemoved(component) {
        this.animators = this.animator.filter(animator => animator !== component);
    }

    update(dt) {
        this.flushStartQueue();

        for (const animator of this.animators) {
            animator.update(dt);
        }
    }

    flushStartQueue() {
        while (this.startQueue.length > 0) {
            const animator = this.startQueue.pop();
            animator.start();
        }
    }
}