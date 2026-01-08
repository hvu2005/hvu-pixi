import { RenderOrder } from "engine/core/component/render-order";
import { Transform } from "engine/core/component/transform";

export class RenderOrder3D extends RenderOrder {
    constructor(order = 0) {
        super(order);
    }
}