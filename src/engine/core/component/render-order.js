import { Component } from "./base/component";
import { Transform } from "./transform";


export class RenderOrder extends Component {
    static ORDER_CHANGED = "orderChanged";

    constructor(order = 0) {
        super();

        this._order = order;
    }

    _onAttach() {
        const transform = this.gameObject.transform;
        /** @param {Transform} parent */
        const onParentChanged = (parent) => {
            const renderOrder = parent.getComponent(RenderOrder);
            this._setOrderInternal(renderOrder.order || 0, false);
        };

        this.offParentChanged = transform.on(Transform.PARENT_CHANGED, onParentChanged);
    }

    _onDestroy() {
        if (this.offParentChanged) {
            this.offParentChanged();
        }
    }

    get order() {
        return this._order;
    }

    set order(newOrder) {
        this._setOrderInternal(newOrder, true);
    }

    _setOrderInternal(newOrder, emitEvent = true) {
        this._order = newOrder;
        this._applyNewOrder(newOrder);
        if (emitEvent) {
            this._emit(RenderOrder.ORDER_CHANGED, newOrder);
        }
    }

    /**
     * @abstract
     * @protected
     * @param {number} newOrder 
     */
    _applyNewOrder(newOrder) {
    }

    /**
     * 
     * @returns {number}
     */
    getNode() {
        return this.order;
    }
}