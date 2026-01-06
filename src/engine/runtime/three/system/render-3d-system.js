import { System } from "engine/core/system/base/system";
import { Transform3D } from "../component/transform-3d";



export class Render3DSystem extends System {
    /**
     * @param {import("engine/core/world").World} world 
     */
    constructor(world) {
        super(world, [Transform3D]);
    }
    
    /**
     * @param {Transform3D} component 
     */
    onComponentAdded(component) {
        const node = component.getNode();
        if (!node || node.parent) return;

        const layerId = component.gameObject.layer;
        const scene = this.world.three.scenes.get(layerId);
        scene.add(component.getNode());
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