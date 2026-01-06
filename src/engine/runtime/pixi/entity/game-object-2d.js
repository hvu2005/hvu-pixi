import { GameObject } from "engine/core/scene-graph/game-object";
import { Transform2D } from "../component/transform-2d";




export class GameObject2D extends GameObject {
    constructor(world) {
        super(world);

        this.transform = this.addComponent(new Transform2D());
    }
}