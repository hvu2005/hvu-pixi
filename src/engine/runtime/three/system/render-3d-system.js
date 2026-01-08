import { System } from "engine/core/system/base/system";
import { RenderOrder3D } from "../component/render-order-3d";
import { interestedComponent } from "engine/core/decorator/interested-component";

@interestedComponent(RenderOrder3D)
export class Render3DSystem extends System {
    /**
     * @param {import("engine/core/world").World} world 
     */
    constructor(world) {
        super(world);

        this.renderContext = world.renderContext;
    }
    
    /**
     * @param {RenderOrder3D} component 
     */
    onComponentAdded(component) {
        const gameObject = component.gameObject;
        const transform = gameObject.transform;

        if (!transform) {
            console.warn("Transform not found on game object!");
            return;
        }
        const node = transform.getNode();
        const layerId = component.getNode();

        this.renderContext.ensureLayer(layerId);
        this.renderContext.addNode3D(node, layerId);

        component.__onOrderChanged = component.on(RenderOrder3D.ORDER_CHANGED, (newOrder) => {
            this.renderContext.ensureLayer(newOrder);
            this.renderContext.removeNode3D(node);
            this.renderContext.addNode3D(node, newOrder);
        });
    }

    /**
     * @param {RenderOrder3D} component 
     */
    onComponentRemoved(component) {
        const gameObject = component.gameObject;
        const transform = gameObject.transform;
        if (!transform) {
            console.warn("Transform not found on game object!");
            return;
        }
        const node = transform.getNode();
        this.renderContext.removeNode3D(node);

        component.__onOrderChanged && component.__onOrderChanged();
    }
}