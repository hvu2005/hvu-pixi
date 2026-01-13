import { GameObject } from "engine/core/scene-graph/game-object";
import { RenderOrder2D } from "engine/modules/render-2d/component/render-order-2d";
import { Transform2D } from "engine/modules/render-2d/component/transform-2d";



export class GameObject2D extends GameObject {
    constructor(world, options = {renderOrder: 0, tag: ""}) {
        super(world, options);

        this.transform = this.addComponent(new Transform2D());
        this.renderOrder = this.addComponent(new RenderOrder2D(options.renderOrder || 0));
    }
}