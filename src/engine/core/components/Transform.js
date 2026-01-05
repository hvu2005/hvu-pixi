import { EventBus } from "../event/event-bus";
import { Component } from "./base/component";

/**
 * @abstract
 */
export class Transform extends Component {

    static POSITION_CHANGED = "positionChanged";
    static ROTATION_CHANGED = "rotationChanged";
    static SCALE_CHANGED = "scaleChanged";

    constructor() {
        super();

        /**
         * @type {Transform}
         * @protected
         */
        this._parent = null;
        /**
         * @type {Transform[]}
         * @protected
         */
        this._children = [];
        
        const self = this;

        /**
         * @private
         */
        this._position = {
            _x: 0,
            _y: 0,
            _z: 0,
            get x() {
                return this._x;
            },
            get y() {
                return this._y;
            },
            get z() {
                return this._z;
            },
            set x(x) {
                this._x = x;
                self._onSetPosition(x, this._y, this._z);
            },
            set y(y) {
                this._y = y;
                self._onSetPosition(this._x, y, this._z);
            },
            set z(z) {
                this._z = z;
                self._onSetPosition(this._x, this._y, z);
            },
            set(x, y, z) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._onSetPosition(x, y, z);
            }
        }

        /**
         * @private
         */
        this._rotation = {
            _x: 0,
            _y: 0,
            _z: 0,
            get x() {
                return this._x;
            },
            get y() {
                return this._y;
            },
            get z() {
                return this._z;
            },
            set x(x) {
                this._x = x;
                self._onSetRotation(x, this._y, this._z);
            },
            set y(y) {
                this._y = y;
                self._onSetRotation(this._x, y, this._z);
            },
            set z(z) {
                this._z = z;
                self._onSetRotation(this._x, this._y, z);
            },
            set(x, y, z) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._onSetRotation(x, y, z);
            }
        }

        /**
         * @private
         */
        this._scale = {
            _x: 1,
            _y: 1,
            _z: 1,
            get x() {
                return this._x;
            },
            get y() {
                return this._y;
            },
            get z() {
                return this._z;
            },
            set x(x) {
                this._x = x;
                self._onSetScale(x, this._y, this._z);
            },
            set y(y) {
                this._y = y;
                self._onSetScale(this._x, y, this._z);
            },
            set z(z) {
                this._z = z;
                self._onSetScale(this._x, this._y, z);
            },
            set(x, y = x, z = x) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._onSetScale(x, y, z);
            }
        }

        /**
         * @type {EventBus}
         * @private
         */
        this._eventBus = new EventBus();
    }

    on(event, callback) {
        return this._eventBus.on(event, callback);
    }

    off(event, callback) {
        this._eventBus.off(event, callback);
    }

    addChild(child) {
        throw new Error("Transform.addChild is not implemented.");
    }

    removeChild(child) {
        throw new Error("Transform.removeChild is not implemented.");
    }

    addRenderNode(node) {
        throw new Error("Transform.addRenderNode is not implemented.");
    }

    removeRenderNode(node) {
        throw new Error("Transform.removeRenderNode is not implemented.");
    }

    get position() {
        return this._position;
    }

    set position(position) {
        this._position.set(position.x, position.y, position.z);
    }

    get rotation() {
        return this._rotation;
    }

    set rotation(rotation) {
        this._rotation.set(rotation.x, rotation.y, rotation.z);
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale.set(scale.x, scale.y, scale.z);
    }

    get parent() {
        throw new Error("Transform.parent is not implemented.");
    }

    set parent(parent) {
        throw new Error("Transform.parent is not implemented.");
    }

    get children() {
        throw new Error("Transform.children is not implemented.");
    }

    /**
     * @private
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _onSetPosition(x, y, z) {
        this._applyPosition(x, y, z);
        this._onPositionChanged(x, y, z);
    }

    /**
     * @private
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _onSetRotation(x, y, z) {
        this._applyRotation(x, y, z);
        this._onRotationChanged(x, y, z);
    }

    /**
     * @private
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _onSetScale(x, y, z) {
        this._applyScale(x, y, z);
        this._onScaleChanged(x, y, z);
    }

    /**
     * @internal
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _setPositionInternal(x, y, z) {
        this._position._x = x;
        this._position._y = y;
        this._position._z = z;
        this._applyPosition(x, y, z);
    }

    /**
     * @internal
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _setRotationInternal(x, y, z) {
        this._rotation._x = x;
        this._rotation._y = y;
        this._rotation._z = z;
        this._applyRotation(x, y, z);
    }

    /**
     * @internal
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    setScaleInternal(x, y, z) {
        this._scale._x = x;
        this._scale._y = y;
        this._scale._z = z;
        this._applyScale(x, y, z);
    }

    /**
     * @protected
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _onPositionChanged(x, y, z) {
        this._eventBus.emit(Transform.POSITION_CHANGED,  x, y, z );
    }

    /**
     * @protected
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _onRotationChanged(x, y, z) {
        this._eventBus.emit(Transform.ROTATION_CHANGED, x, y, z);
    }

    /**
     * @protected
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _onScaleChanged(x, y, z) {
        this._eventBus.emit(Transform.SCALE_CHANGED, x, y, z);
    }

    /**
     * @protected
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _applyPosition(x, y, z) {

    }

    /**
     * @protected
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _applyRotation(x, y, z) {

    }

    /**
     * @protected
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _applyScale(x, y, z) {

    }
}