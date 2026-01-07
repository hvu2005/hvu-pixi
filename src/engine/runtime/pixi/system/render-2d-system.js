import { System } from "engine/core/system/base/system";
import { Transform2D } from "../component/transform-2d";





export class Render2DSystem extends System {
    /**
     * @param {import("engine/core/world").World} world 
     */
    constructor(world) {
        super(world, [Transform2D]);

        this.renderContext = world.renderContext;
    }

    /**
     * 
     * @param {Transform2D} component 
     */
    onComponentAdded(component) {
        const node = component.getNode();
        if (!node || node.parent) return;

        const layerId = component.gameObject.layer;
        this.renderContext.addNode2D(node, layerId);
    }

    /**
     * 
     * @param {Transform2D} component 
     */
    onComponentRemoved(component) {
        const node = component.getNode();
        if (!node) return;
        
        const parent = node.parent;
        if (parent) {
            parent.removeChild(node);
        }
    }


}