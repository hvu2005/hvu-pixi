import { Bodies } from 'matter-js';
import { Collider } from './Collider';

export class BoxCollider extends Collider {
    constructor(options = {}) {
        super(options);
        this.options.width = options.width ?? 50;
        this.options.height = options.height ?? 50;
    }

    _createBody() {
        const o = this.options;
        const posX = (this.gameObject?.position?.x ?? 0) + o.x;
        const posY = (this.gameObject?.position?.y ?? 0) + o.y;

        const body = Bodies.rectangle(posX, posY, o.width, o.height, {
            isStatic: o.isStatic,
            isSensor: o.isSensor,
            label: o.label,
        });

        body.collider = this;
        return body;
    }
}
