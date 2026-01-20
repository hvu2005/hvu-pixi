import { GameObject } from "engine/core/scene-graph/game-object";
import { RenderOrder2D } from "engine/modules/render-2d/component/render-order-2d";
import { Transform2D } from "engine/modules/render-2d/component/transform-2d";



export class GameObject2D extends GameObject {
    constructor(world, options = {renderOrder: 0, tag: ""}) {

        const mergedOptions = { 
            ...options, 
            components: [
                new Transform2D(), 
                new RenderOrder2D(options.renderOrder || 0),
                ...(options.components || [])
            ],
        };
        super(world, mergedOptions);

        options.position && this.transform.position.set(options.position);
        options.rotation && this.transform.rotation.set(options.rotation);
        options.scale && this.transform.scale.set(options.scale);
    }
}