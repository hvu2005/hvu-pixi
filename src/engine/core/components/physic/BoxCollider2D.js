import { Bodies } from "matter-js";
import { Collider2D } from "./Collider2D";





export class BoxCollider2D extends Collider2D {
    constructor(options = {}) {
        super(options);

        this.options = {
            ...this.options,
            width: options.width || 50,
            height: options.height || 50,
        }
    }

    _createBody() {
        return Bodies.rectangle(
            this.options.x,
            this.options.y,
            this.options.width,
            this.options.height,
            {
                isStatic: this.options.isStatic,
                isSensor: this.options.isSensor,
            }
        );
    }
}