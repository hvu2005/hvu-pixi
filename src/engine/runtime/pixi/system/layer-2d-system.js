import { System } from "engine/core/system/base/system";
import { Layer2D } from "../component/layer-2d";
import { Transform2D } from "../component/transform-2d";




export class Layer2DSystem extends System {
    /**
     * @param {import("engine/core/world").World} world 
     */
    constructor(world) {
        super(world, [Layer2D]);

        this.renderContext = world.renderContext;
    }

    /**
     * 
     * @param {Layer2D} component 
     */
    onComponentAdded(component) {
        const node = component.gameObject.transform.getNode();
        if (!(node instanceof Transform2D)) return;

        const pixi = this.renderContext.pixi;
        if (!pixi) return;

        const layerId = component.order;
        pixi.getLayer(layerId).addChild(node);
    }
}