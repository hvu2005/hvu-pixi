import { GameObject } from "engine/core/entity/GameObject";
import { Transform2D } from "../component/Transform2D";




export class GameObject2D extends GameObject {
    constructor(world) {
        super(world);

        this.transform = this.addComponent(new Transform2D());
    }
}