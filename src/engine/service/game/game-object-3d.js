import { GameObject } from "engine/core/scene-graph/game-object";
import { Transform3D } from "engine/modules/render-3d/component/transform-3d";
import { RenderOrder3D } from "engine/modules/render-3d/component/render-order-3d";




export class GameObject3D extends GameObject {
    constructor(world, options = {renderOrder: 0, tag: ""}) {
        super(world, options);
        
        this.transform = this.addComponent(new Transform3D());
        this.renderOrder = this.addComponent(new RenderOrder3D(options.renderOrder || 0));
    }
}