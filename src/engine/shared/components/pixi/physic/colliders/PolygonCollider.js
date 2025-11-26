import { Bodies, Vertices } from 'matter-js';
import { Collider } from './Collider';

export class PolygonCollider extends Collider {
    constructor(options = {}) {
        super(options);
        this.options.points = options.points ?? [];
    }

    _createBody() {
        const o = this.options;
        const posX = (this.gameObject?.position?.x ?? 0) + o.x;
        const posY = (this.gameObject?.position?.y ?? 0) + o.y;

        if (!o.points || o.points.length < 3) {
            console.warn("⚠️ PolygonCollider cần ít nhất 3 điểm hợp lệ!");
            return Bodies.rectangle(posX, posY, 50, 50);
        }

        const verts = Vertices.create(o.points);
        const body = Bodies.fromVertices(posX, posY, verts, {
            isStatic: o.isStatic,
            isSensor: o.isSensor,
            label: o.label,
        });

        body.collider = this;
        return body;
    }
}
