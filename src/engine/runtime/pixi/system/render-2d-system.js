import { System } from "engine/core/system/base/system";
import { RenderOrder2D } from "../component/render-order-2d";
import { interestedComponent } from "engine/core/decorator/interested-component";


@interestedComponent(RenderOrder2D)
export class Render2DSystem extends System {
    /**
     * @param {import("engine/core/world").World} world 
     */
    constructor(world) {
        super(world);

        this.renderContext = world.renderContext;
    }

    /**
     * 
     * @param {RenderOrder2D} component 
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
        this.renderContext.addNode2D(node, layerId);

        component.__onOrderChanged = component.on(RenderOrder2D.ORDER_CHANGED, (newOrder) => {
            this.renderContext.ensureLayer(newOrder);
            this.renderContext.removeNode2D(node);
            this.renderContext.addNode2D(node, newOrder);
        });
    }

    /**
     * 
     * @param {RenderOrder2D} component 
     */
    onComponentRemoved(component) {
        const gameObject = component.gameObject;
        const transform = gameObject.transform;
        if (!transform) {
            console.warn("Transform not found on game object!");
            return;
        }
        
        const node = transform.getNode();
        this.renderContext.removeNode2D(node);

        component.__onOrderChanged && component.__onOrderChanged();
    }


}