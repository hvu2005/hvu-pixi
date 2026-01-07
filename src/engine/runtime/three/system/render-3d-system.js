import { System } from "engine/core/system/base/system";
import { Transform3D } from "../component/transform-3d";



export class Render3DSystem extends System {
    /**
     * @param {import("engine/core/world").World} world 
     */
    constructor(world) {
        super(world, [Transform3D]);

        this.renderContext = world.renderContext;
    }
    
    /**
     * @param {Transform3D} component 
     */
    onComponentAdded(component) {
        const node = component.getNode();
        if (!node) return;

        const layerId = component.gameObject.layer;
        this.renderContext.addNode3D(node, layerId);
    }

    /**
     * @param {Transform3D} component 
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