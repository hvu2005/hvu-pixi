import { Component } from "engine/core/component/base/Component";
import { Bodies, Body } from "matter-js";

export class Collider2D extends Component {
    constructor(options = {}) {
        super();

        const {
            x = 0,
            y = 0,
            width = 250,
            height = 250,
            mass = 1,
            friction = 0.5,
            restitution = 0.5,
            isStatic = false,
            isSensor = false,
            angle = 0
        } = options;

        this.body = Bodies.rectangle(x, y, width, height, {
            mass,
            friction,
            restitution,
            isStatic,
            isSensor,
            angle
        });

        this._lastScale = { x: 1, y: 1 };
    }
    
    _onAttach() {
        const transform = this.gameObject.transform;
        const { x, y } = transform.position;
        Body.setPosition(this.body, { x, y });

        if (!this._synced) {
            this._syncPosition();
            this._syncRotation();
            this._syncScale();
            this._synced = true;
        }
    }

    /**
     * @private
     */
    _syncPosition() {
        const transform = this.gameObject.transform;
        const oldSetPosition = transform._onPositionChanged.bind(transform);
        transform._onPositionChanged = (x, y) => {
            oldSetPosition(x, y);
            Body.setPosition(this.body, { x, y });
        }
    }

    /**
     * @private
     */
    _syncRotation() {
        const transform = this.gameObject.transform;
        const oldSetRotation = transform._onRotationChanged.bind(transform);
        transform._onRotationChanged = (x, y, z) => {
            oldSetRotation(x, y, z);
            Body.setAngle(this.body, z);
        }
    }

    /**
     * @private
     */
    _syncScale() {
        const transform = this.gameObject.transform;
        const oldSetScale = transform._onScaleChanged.bind(transform);
        transform._onScaleChanged = (x, y, z) => {
            oldSetScale(x, y, z);
            const scaleX = x / this._lastScale.x;
            const scaleY = y / this._lastScale.y;
            Body.scale(this.body, scaleX, scaleY);
            this._lastScale.x = x;
            this._lastScale.y = y;
        }
    }
    
    /**
     * 
     * @returns {Matter.Body}
     */
    getNode() {
        return this.body;
    }
}
