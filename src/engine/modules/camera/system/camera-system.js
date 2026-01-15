import { System } from "engine/core/system/base/system";
import { interestedComponent } from "engine/core/decorator/interested-component";
import { World } from "engine/core/world";
import { CameraView } from "../component/camera-view";


@interestedComponent(CameraView)
export class CameraSystem extends System {
    /**
     * 
     * @param {World} world 
     */
    constructor(world) {
        super(world);

        this.renderContext = world.renderContext;
    }

    /**
     * 
     * @param {CameraView} component 
     */
    onComponentAdded(component) {
        this.renderContext.setCamera(component.getNode());
    }

    /**
     * 
     * @param {CameraView} component 
     */
    onComponentRemoved(component) {
        this.renderContext.resetCamera();
    }
}