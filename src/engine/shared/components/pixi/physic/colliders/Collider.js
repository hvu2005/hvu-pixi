import { Body, Events } from 'matter-js';
import { collisionManager, CoreEventType, eventBus } from "../../../../../core/core.d";
import { Component } from "../../../base/Component";
import { Point } from '@pixi.alias';
// import { extensions } from 'pixi.js';


export class Collider extends Component {
    /**
     * @param {ColliderOptions} options
     */
    constructor(options = {}) {
        super();
        this.options = {
            x: options.x ?? 0,
            y: options.y ?? 0,
            isStatic: options.isStatic ?? false,
            label: options.label ?? "none",
            isSensor: options.isSensor ?? true,
        };
    }

    _createBody() {
        throw new Error("_createBody() phải được ghi đè trong lớp con!");
    }

    /**
     * @override
     */
    __init() {
        if (this.options.sprite) {
            this.options.width = this.options.sprite.width * this.gameObject.scale.x;
            this.options.height = this.options.sprite.height * this.gameObject.scale.y;
        }
        this.body = this._createBody();
        collisionManager.registerCollider(this.body);
        // this._autoPositionHandler = this.autoPosition.bind(this);

        // Events.on(collisionManager.engine, 'afterUpdate', this._autoPositionHandler);


        this.body.collisionFilter.mask = 0;

        requestAnimationFrame(() => {
            this.body.collisionFilter.mask = 0xFFFFFFFF;
        })


        this._pendingEnableMask = false;
        Events.on(collisionManager.engine, 'afterUpdate', () => {
            if (this._pendingEnableMask) {
                this.body.collisionFilter.category = 0x0001;
                this.body.collisionFilter.mask = 0xFFFFFFFF;
                this._pendingEnableMask = false;
            }
        });

        // this.autoPosition();
        this.syncPosition();
        this.syncRotation();
    }

    autoPosition() {
        collisionManager.updateColliderPosition(this.body, this.gameObject);
    }

    onTriggerEnter(other) {
        if (this.gameObject) {
            eventBus.emit(CoreEventType.COLLISION + this.gameObject.ID, other);
        }
    }


    _onDisable() {
        // Events.off(collisionManager.engine, 'afterUpdate', this._autoPositionHandler);
        this.body.collisionFilter.mask = 0;
        this.body.collisionFilter.category = 0;
        Body.setPosition(this.body, { x: 999999, y: 999999 });
    }


    _onEnable() {
        // Events.on(collisionManager.engine, 'afterUpdate', this._autoPositionHandler);
        // this._autoPositionHandler.call(this);

        // Đánh dấu bật mask ở tick tiếp theo
        this._pendingEnableMask = true;
    }

    //#region binding sync

    /**
     * Đồng bộ hai chiều giữa gameObject.position và body.position
     */
    syncPosition() {
        const self = this;
        const pos = this.gameObject.position;
        const point = new Point();

        // 🔹 Proxy để khi GameObject thay đổi => cập nhật body
        const proxyPos = new Proxy(pos, {
            set(target, prop, value) {
                target[prop] = value;
                if ((prop === '_x' || prop === '_y') && self.body) {
                    const worldPos = self.gameObject.getGlobalPosition(point);

                    Body.setPosition(self.body, { x: worldPos.x, y: worldPos.y });
                    self.body.velocity.x = 0;
                    self.body.velocity.y = 0;
                }
                return true;
            },
            get(target, prop) {
                return target[prop];
            }
        });

        Object.defineProperty(this.gameObject, 'position', {
            get() {
                return proxyPos;
            }
        });

        this._onAddedSyncPosition = () => {
            queueMicrotask(() => {
                if (!self.body) return;

                const worldPos = self.gameObject.getGlobalPosition(point);
                Body.setPosition(self.body, { x: worldPos.x, y: worldPos.y });
                self.body.velocity.x = 0;
                self.body.velocity.y = 0;
            });
        }

        self.gameObject.on('added', this._onAddedSyncPosition, this);

        // 🔁 Sau mỗi bước physics, sync ngược Body → GameObject
        const updatePositionSync = () => {
            if (!self.body || !self.gameObject) return;

            const bpos = self.body.position;
            const target = self.gameObject;
            const pos = target.position;
            const parent = target.parent;

            // Nếu có cha → chuyển từ world → local bằng ma trận nghịch đảo
            if (parent && parent.worldTransform) {
                const local = { x: 0, y: 0 };
                parent.worldTransform.applyInverse(bpos, local);

                pos.x = local.x;
                pos.y = local.y;
            }
            else {
                // Nếu không có cha (nằm ở root) thì world = local
                pos.x = bpos.x;
                pos.y = bpos.y;
            }
        };

        Events.on(collisionManager.engine, 'afterUpdate', updatePositionSync);
        this._updatePositionSync = updatePositionSync;
    }


    /**
     * Đồng bộ hai chiều giữa gameObject.rotation và body.angle
     */
    /**
     * Đồng bộ hai chiều giữa gameObject.rotation và body.angle
     * Ưu tiên hướng người dùng: nếu set rotation thủ công → body theo sprite,
     * nếu vật lý thay đổi → sprite theo body.
     */
    syncRotation() {
        const self = this;
        const target = this.gameObject;
        if (!target) return;

        // 🔹 Tìm getter/setter rotation gốc trong Pixi
        let proto = Object.getPrototypeOf(target);
        let desc = null;
        while (proto && !desc) {
            desc = Object.getOwnPropertyDescriptor(proto, "rotation");
            proto = Object.getPrototypeOf(proto);
        }
        if (!desc || typeof desc.set !== "function") return;

        const origSet = desc.set.bind(target);
        const origGet = desc.get.bind(target);

        let _isManualSet = false;
        self._isReady = false; // Cờ xác định khi nào đã add vào scene

        // --- Ghi đè rotation để đồng bộ GameObject → Body ---
        Object.defineProperty(target, "rotation", {
            get() {
                return origGet();
            },
            set(value) {
                _isManualSet = true;
                origSet(value);

                if (self.body && self._isReady) {
                    const wt = target.getGlobalTransform();
                    const worldAngle = Math.atan2(wt.b, wt.a);
                    Body.setAngle(self.body, worldAngle);
                    self.body.angularVelocity = 0;
                }

                queueMicrotask(() => (_isManualSet = false));
            },
            configurable: true,
        });

        this._onAddedSyncRotation = () => {
            queueMicrotask(() => {
                self._isReady = true;
                if (self.body) {
                    const wt = target.getGlobalTransform();
                    const worldAngle = Math.atan2(wt.b, wt.a);
                    Body.setAngle(self.body, worldAngle);
                }
            });
        }

        // --- Khi object được add vào scene ---
        target.on("added", this._onAddedSyncRotation, this);

        // --- Body → GameObject mỗi frame ---
        const updateRotationSync = () => {
            if (!self._isReady || !self.body || !target) return;
            if (_isManualSet) return;

            const bodyAngle = self.body.angle;
            let parentAngle = 0;

            if (target.parent) {
                const pmatrix = target.parent.getGlobalTransform();
                parentAngle = Math.atan2(pmatrix.b, pmatrix.a);
            }

            // Tính local angle = world - parent
            origSet(bodyAngle - parentAngle);
        };

        Events.on(collisionManager.engine, "afterUpdate", updateRotationSync);
        this._updateRotationSync = updateRotationSync;
    }


    //#endregion

    _onDestroy() {
        // 🧩 1. Gỡ listener Matter.js
        if (this._updatePositionSync) {
            Events.off(collisionManager.engine, "afterUpdate", this._updatePositionSync);
            this._updatePositionSync = null;
        }

        if (this._updateRotationSync) {
            Events.off(collisionManager.engine, "afterUpdate", this._updateRotationSync);
            this._updateRotationSync = null;
        }

        // 🧩 2. Gỡ listener Pixi (on added)
        if (this._onAddedSyncPosition && this.gameObject) {
            this.gameObject.off("added", this._onAddedSyncPosition, this);
            this._onAddedSyncPosition = null;
        }

        if (this._onAddedSyncRotation && this.gameObject) {
            this.gameObject.off("added", this._onAddedSyncRotation, this);
            this._onAddedSyncRotation = null;
        }

        // 🧩 3. Xóa body khỏi Matter world
        if (this.body) {
            try {
                collisionManager.unregisterCollider(this.body);
            } catch (e) {
                console.warn("⚠️ Collider already unregistered:", e);
            }
        }

    }


}


