import { GameObject } from "engine/core/scene-graph/game-object";
import { Transform2D } from "../component/transform-2d";
import { Layer2D } from "../component/layer-2d";




export class GameObject2D extends GameObject {
    constructor(world, options = {layer: 0, tag: ""}) {
        super(world, options);

        this.transform = this.addComponent(new Transform2D());
        this.layer = this.addComponent(new Layer2D(options.layer || 0));
    }
}