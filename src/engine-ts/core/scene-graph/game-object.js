import { EventEmitter } from "engine-ts/core/event/event-emitter";




/**
 * @type {}
 */
export class GameObject extends EventEmitter {

    static ADD = "add";
    static REMOVE = "remove";
    static PARENT_CHANGED = "parent-changed";
    static POSITION_CHANGED = "position-changed";
    static ROTATION_CHANGED = "rotation-changed";
    static SCALE_CHANGED = "scale-changed";

    constructor() {
        super();

        this.add;
        this.behaviour;
        this.physics;

        const self = this;
        this._position = {
            _x: 0, get x() { return this._x }, set x(value) { this.set(value, this._y, this._z) },
            _y: 0, get y() { return this._y }, set y(value) { this.set(this._x, value, this._z) },
            _z: 0, get z() { return this._z }, set z(value) { this.set(this._x, this._y, value) },
            set(x, y, z) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._setPositionInternal(x, y, z, false);
            }
        }

        this._rotation = {

        }

        this._scale = {

        }
    }

    get position() {
        return this._position;
    }

    set position(pos) {
        this._position.set(pos.x, pos.y, pos.z);
    }

    get rotation() {

    }

    get scale() {

    }

    /**
     * @internal
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {boolean} emit 
     */
    _setPositionInternal(x, y, z, emit = false) {
        this._position._x = x;
        this._position._y = y;
        this._position._z = z;
        if (emit) {
            this._emit(GameObject.POSITION_CHANGED, x, y, z);
        }
    }

    /**
     * @protected
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _applyPosition(x, y, z) {
    }
}