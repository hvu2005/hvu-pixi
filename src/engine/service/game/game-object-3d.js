import { GameObject } from "engine/core/scene-graph/game-object";
import { Transform3D } from "engine/modules/render-3d/component/transform-3d";
import { RenderOrder3D } from "engine/modules/render-3d/component/render-order-3d";




export class GameObject3D extends GameObject {
    constructor(world, options = {renderOrder: 0, tag: ""}) {
        const mergedOptions = { 
            ...options, 
            components: [
                new Transform3D(), 
                new RenderOrder3D(options.renderOrder || 0),
                ...(options.components || [])
            ],
        };
        super(world, mergedOptions);

        options.position && this.transform.position.set(...options.position);
        options.rotation && this.transform.rotation.set(...options.rotation);
        options.scale && this.transform.scale.set(...options.scale);
    }
}