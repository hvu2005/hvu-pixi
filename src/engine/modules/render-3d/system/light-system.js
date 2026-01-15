import { interestedComponent } from "engine/core/decorator/interested-component";
import { System } from "engine/core/system/base/system";
import { Light3D } from "../component/abstract/light-3d";

@interestedComponent(Light3D)
export class LightSystem extends System {
    constructor(world) {
        super(world);
    }

    /**
     * 
     * @param {Light3D} component 
     */
    onComponentAdded(component) {

    }

    /**
     * 
     * @param {Light3D} component 
     */
    onComponentRemoved(component) {

    }
}