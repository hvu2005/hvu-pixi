import { System } from "engine/core/system/base/System";
import { Transform2D } from "../component/Transform2D";





export class Render2DSystem extends System {
    constructor(world) {
        super(world, [Transform2D]);

        this.stage = world.pixi.stage;
    }

    /**
     * 
     * @param {Transform2D} component 
     */
    onComponentAdded(component) {
        const node = component.getNode();
        if (node || node.parent) return;

        this.stage.addChild(component.getNode());
    }

    /**
     * 
     * @param {Transform2D} component 
     */
    onComponentRemoved(component) {
        const node = component.getNode();
        const parent = node.parent;
        if (parent) {
            parent.removeChild(node);
        }
    }
}