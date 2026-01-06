import { Component } from "./base/component";

/**
 * @abstract
 */
export class Transform extends Component {

    static POSITION_CHANGED = "positionChanged";
    static ROTATION_CHANGED = "rotationChanged";
    static SCALE_CHANGED = "scaleChanged";
    static CHILD_ADDED = "childAdded";
    static CHILD_REMOVED = "childRemoved";
    static PARENT_CHANGED = "parentChanged";

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
            _x: 0, _y: 0, _z: 0,
            get x() { return this._x; },
            get y() { return this._y; },
            get z() { return this._z; },
            set x(x) { this.set(x, this._y, this._z); },
            set y(y) { this.set(this._x, y, this._z); },
            set z(z) { this.set(this._x, this._y, z); },
            set(x, y, z) {
                self._setPositionInternal(x, y, z);
            },
        }

        /**
         * @private
         */
        this._rotation = {
            _x: 0, _y: 0, _z: 0,
            get x() { return this._x; },
            get y() { return this._y; },
            get z() { return this._z; },
            set x(x) { this.set(x, this._y, this._z); },
            set y(y) { this.set(this._x, y, this._z); },
            set z(z) { this.set(this._x, this._y, z); },
            set(x, y, z) {
                self._setRotationInternal(x, y, z);
            },
        }

        /**
         * @private
         */
        this._scale = {
            _x: 1, _y: 1, _z: 1,
            get x() { return this._x; },
            get y() { return this._y; },
            get z() { return this._z; },
            set x(x) { this.set(x, this._y, this._z); },
            set y(y) { this.set(this._x, y, this._z); },
            set z(z) { this.set(this._x, this._y, z); },
            set(x, y, z) {
                self._setScaleInternal(x, y, z);
            },
        }

    }


    /**
     * 
     * @param {Transform} child 
     */
    addChild(child) {
        this._children.push(child);
        child._setParentInternal(this);
    }

    /**
     * @param {Transform} child 
     */
    removeChild(child) {
        this._children = this._children.filter(c => c !== child);
        child._setParentInternal(null);
    }

    addRenderNode(node) {
        throw new Error("Transform.addRenderNode is not implemented.");
    }

    removeRenderNode(node) {
        throw new Error("Transform.removeRenderNode is not implemented.");
    }

    //#region Getters and Setters
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
        return this._parent;
    }

    set parent(parent) {
        if (this._parent) {
            this._parent.removeChild(this);
        }

        this._parent = parent;
        this._parent.addChild(this);
    }

    get children() {
        throw new Error("Transform.children is not implemented.");
    }
    //#endregion

    //#region Internal
    /**
     * @internal
     * @param {Transform} parent 
     */
    _setParentInternal(parent) {
        this._parent = parent;
    }

    /**
     * @internal
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _setPositionInternal(x = this._position._x, y = this._position._y, z = this._position._z, emitEvent = true) {
        this._position._x = x;
        this._position._y = y;
        this._position._z = z;
        this._applyPosition(x, y, z);
        if (emitEvent) {
            this._emit(Transform.POSITION_CHANGED, x, y, z);
        }
    }

    /**
     * @internal
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _setRotationInternal(x = this._rotation._x, y = this._rotation._y, z = this._rotation._z, emitEvent = true) {
        this._rotation._x = x;
        this._rotation._y = y;
        this._rotation._z = z;
        this._applyRotation(x, y, z);
        if (emitEvent) {
            this._emit(Transform.ROTATION_CHANGED, x, y, z);
        }
    }

    /**
     * @internal
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _setScaleInternal(x = this._scale._x, y = x, z = x, emitEvent = true) {
        this._scale._x = x;
        this._scale._y = y;
        this._scale._z = z;
        this._applyScale(x, y, z);
        if (emitEvent) {
            this._emit(Transform.SCALE_CHANGED, x, y, z);
        }
    }
    //#endregion

    //#region Apply Functions
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
    //#endregion

}