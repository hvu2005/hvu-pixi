import { EventBus } from "../event/EventBus";
import { Component } from "./base/Component";

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
                self._onPositionChanged(x, this._y, this._z);
            },
            set y(y) {
                this._y = y;
                self._onPositionChanged(this._x, y, this._z);
            },
            set z(z) {
                this._z = z;
                self._onPositionChanged(this._x, this._y, z);
            },
            set(x, y, z) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._onPositionChanged(x, y, z);
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
                self._onRotationChanged(x, this._y, this._z);
            },
            set y(y) {
                this._y = y;
                self._onRotationChanged(this._x, y, this._z);
            },
            set z(z) {
                this._z = z;
                self._onRotationChanged(this._x, this._y, z);
            },
            set(x, y, z) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._onRotationChanged(x, y, z);
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
                self._onScaleChanged(x, this._y, this._z);
            },
            set y(y) {
                this._y = y;
                self._onScaleChanged(this._x, y, this._z);
            },
            set z(z) {
                this._z = z;
                self._onScaleChanged(this._x, this._y, z);
            },
            set(x, y = x, z = x) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._onScaleChanged(x, y, z);
            }
        }

        /**
         * @type {EventBus}
         * @private
         */
        this._eventBus = new EventBus();
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

    _onPositionChanged(x, y, z) {
        this._eventBus.emit(Transform.POSITION_CHANGED,  x, y, z );
    }

    _onRotationChanged(x, y, z) {
        this._eventBus.emit(Transform.ROTATION_CHANGED, x, y, z);
    }

    _onScaleChanged(x, y, z) {
        this._eventBus.emit(Transform.SCALE_CHANGED, x, y, z);
    }

}