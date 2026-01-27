import { System } from "engine/core/system/base/system";
import { interestedComponent } from "engine/core/decorator/interested-component";
import { World } from "engine/core/world";
import { CameraView } from "../component/camera-view";
import { executeOrder } from "engine/core/decorator/execute-order";

@executeOrder(7)
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
        this.renderContext.setCamera(component.getNode(), component.fov);

        component.on(CameraView.FOV_CHANGED, this.onFovChanged.bind(this));
    }

    onFovChanged(component, fov) {
        this.renderContext.setCamera(component.getNode(), fov);
    }

    /**
     * 
     * @param {CameraView} component 
     */
    onComponentRemoved(component) {
        this.renderContext.resetCamera();
    }
}