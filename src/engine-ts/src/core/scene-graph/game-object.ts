import { EventEmitter } from "../event/event-emitter";

type GameObjectEventMap = {
    'add': [];
    'remove': [];
    'parent-changed': [];
    'position-changed': [number, number, number];
    'rotation-changed': [number, number, number];
    'scale-changed': [number, number, number];
};

type Vec3 = {
    _x: number;
    _y: number;
    _z: number;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    set(x: number, y: number, z: number): void;
}

export class GameObject extends EventEmitter<GameObjectEventMap> {
    public node: any = null;
    public behaviour: any = null;
    public physics: any = null;
    public add: any = {};

    private _position: Vec3;
    private _rotation: Vec3;
    private _scale: Vec3;

    constructor() {
        super();

        // Position
        const self = this;
        this._position = {
            _x: 0,
            _y: 0,
            _z: 0,
            get x() { return this._x; },
            set x(value: number) { this.set(value, this._y, this._z); },
            get y() { return this._y; },
            set y(value: number) { this.set(this._x, value, this._z); },
            get z() { return this._z; },
            set z(value: number) { this.set(this._x, this._y, value); },
            set(x: number, y: number, z: number) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._setPositionInternal(x, y, z, true);
            }
        };

        // Rotation
        this._rotation = {
            _x: 0,
            _y: 0,
            _z: 0,
            get x() { return this._x; },
            set x(value: number) { this.set(value, this._y, this._z); },
            get y() { return this._y; },
            set y(value: number) { this.set(this._x, value, this._z); },
            get z() { return this._z; },
            set z(value: number) { this.set(this._x, this._y, value); },
            set(x: number, y: number, z: number) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._setRotationInternal(x, y, z, true);
            }
        };

        // Scale
        this._scale = {
            _x: 1,
            _y: 1,
            _z: 1,
            get x() { return this._x; },
            set x(value: number) { this.set(value, this._y, this._z); },
            get y() { return this._y; },
            set y(value: number) { this.set(this._x, value, this._z); },
            get z() { return this._z; },
            set z(value: number) { this.set(this._x, this._y, value); },
            set(x: number, y: number, z: number) {
                this._x = x;
                this._y = y;
                this._z = z;
                self._setScaleInternal(x, y, z, true);
            }
        };
    }

    get position(): Vec3 {
        return this._position;
    }

    set position(pos: { x: number; y: number; z: number }) {
        this._position.set(pos.x, pos.y, pos.z);
    }

    get rotation(): Vec3 {
        return this._rotation;
    }

    set rotation(rot: { x: number; y: number; z: number }) {
        this._rotation.set(rot.x, rot.y, rot.z);
    }

    get scale(): Vec3 {
        return this._scale;
    }

    set scale(scale: { x: number; y: number; z: number }) {
        this._scale.set(scale.x, scale.y, scale.z);
    }


    public _setPositionInternal(x: number, y: number, z: number, emit: boolean = false): void {
        this._position._x = x;
        this._position._y = y;
        this._position._z = z;
        if (emit) {
            this._emit('position-changed', x, y, z);
        }
    }

    public _setRotationInternal(x: number, y: number, z: number, emit: boolean = false): void {
        this._rotation._x = x;
        this._rotation._y = y;
        this._rotation._z = z;
        if (emit) {
            this._emit('rotation-changed', x, y, z);
        }
    }

    public _setScaleInternal(x: number, y: number, z: number, emit: boolean = false): void {
        this._scale._x = x;
        this._scale._y = y;
        this._scale._z = z;
        if (emit) {
            this._emit('scale-changed', x, y, z);
        }
    }


    protected _applyPosition(x: number, y: number, z: number): void {

    }


    protected _applyRotation(x: number, y: number, z: number): void {

    }

    protected _applyScale(x: number, y: number, z: number): void {

    }
}