import { Bodies } from 'matter-js';
import { Collider } from './Collider';

export class CircleCollider extends Collider {
    constructor(options = {}) {
        super(options);
        this.options.radius = options.radius ?? 25;
    }

    _createBody() {
        const o = this.options;
        const posX = (this.gameObject?.position?.x ?? 0) + o.x;
        const posY = (this.gameObject?.position?.y ?? 0) + o.y;

        const body = Bodies.circle(posX, posY, o.radius, {
            isStatic: o.isStatic,
            isSensor: o.isSensor,
            label: o.label,
        });

        body.collider = this;
        return body;
    }
}
