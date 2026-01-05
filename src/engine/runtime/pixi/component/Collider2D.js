import { Transform } from "engine/core/component/Transform";
import { Component } from "engine/core/component/base/Component";
import { EventBus } from "engine/core/event/EventBus";
import { Bodies, Body } from "matter-js";

export class Collider2D extends Component {
    static ON_COLLISION_ENTER = "onCollisionEnter";
    static ON_COLLISION_EXIT = "onCollisionExit";
    static ON_COLLISION_STAY = "onCollisionStay";

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
            isStatic = true,
            isSensor = true,
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

        /**
         * @private
         * @type {{x: number, y: number}}
         */
        this._lastScale = { x: 1, y: 1 };

        /**
         * @private
         * @type {EventBus}
         */
        this._eventBus = new EventBus();
    }

    on(event, callback) {
        return this._eventBus.on(event, callback);
    }

    off(event, callback) {
        this._eventBus.off(event, callback);
    }

    onCollisionEnter(other) {
        this._eventBus.emit(Collider2D.ON_COLLISION_ENTER, other);
    }
    
    onCollisionExit(other) {
        this._eventBus.emit(Collider2D.ON_COLLISION_EXIT, other);
    }

    onCollisionStay(other) {
        this._eventBus.emit(Collider2D.ON_COLLISION_STAY, other);
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
        this.offPositionSync = transform.on(Transform.POSITION_CHANGED, (x, y, z) => {
            Body.setPosition(this.body, { x, y });
        });
    }

    /**
     * @private
     */
    _syncRotation() {
        const transform = this.gameObject.transform;
        this.offRotationSync = transform.on(Transform.ROTATION_CHANGED, (x, y, z) => {
            Body.setAngle(this.body, z);
        });
    }

    /**
     * @private
     */
    _syncScale() {
        const transform = this.gameObject.transform;
        this.offScaleSync = transform.on(Transform.SCALE_CHANGED, (x, y, z) => {
            const scaleX = x / this._lastScale.x;
            const scaleY = y / this._lastScale.y;
            Body.scale(this.body, scaleX, scaleY);
            this._lastScale.x = x;
            this._lastScale.y = y;
        });
    }

    _onDestroy() {
        this._eventBus.clear();
        this.offPositionSync();
        this.offRotationSync();
        this.offScaleSync();
    }
    
    /**
     * 
     * @returns {Matter.Body}
     */
    getNode() {
        return this.body;
    }
}
