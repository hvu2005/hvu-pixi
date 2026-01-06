import { GameObject } from "engine/core/scene-graph/game-object";
import { Transform3D } from "../component/transform-3d";




export class GameObject3D extends GameObject {
    constructor(world, options = {layer: 0, tag: ""}) {
        super(world, options);
        
        this.transform = this.addComponent(new Transform3D());
    }
}