import { RenderOrder } from "engine/core/component/render-order";
import { Transform } from "engine/core/component/transform";

export class RenderOrder3D extends RenderOrder {
    constructor(order = 0) {
        super(order);
    }

    _onAttach() {
        const transform = this.gameObject.transform;

        /** @param {Transform} parent */
        const onParentChanged = (parent) => {
            const renderOrder = parent.getComponent(RenderOrder3D);
            this._setOrderInternal(renderOrder.order || 0, false);
        };

        this.offParentChanged = transform.on(Transform.PARENT_CHANGED, onParentChanged);
    }

    _onDestroy() {
        if (this.offParentChanged) {
            this.offParentChanged();
        }
    }
}