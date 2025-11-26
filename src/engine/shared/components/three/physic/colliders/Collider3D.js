
import { eventBus, CoreEventType, gameLifecycle } from '@engine';
import { Vector3 } from '@three.alias';
import { collision3DManager } from 'engine/core/system/physic/Collision3DManager';
import { Component } from 'engine/shared/components/base/Component';


/**
 * @typedef {Object} Collider3DOptions
 * @property {xyz} [offset]
 * @property {number} [width]
 * @property {number} [height]
 * @property {number} [depth]
 * @property {boolean} [isStatic]
 * @property {string} [label]
 * @property {boolean} [isSensor]
 * @property {'box' | 'sphere' | 'cylinder'} [shapeType]
 */
export class Collider3D extends Component {
  /**
   * @param {Collider3DOptions} options
   */
  constructor(options = {}) {
    super();

    const defaults = {
      offset: { x: 0, y: 0, z: 0 },
      width: 1,
      height: 1,
      depth: 1,
      radius: 0.5,
      isStatic: false,
      label: 'none',
      isSensor: true,
      shapeType: 'box',
    };

    this.options = Object.assign(defaults, options);
  }

  /**
   * @override
   */
  __init() {
    // Cập nhật scale theo GameObject (nếu có)
    if (this.gameObject?.scale) {
      this.options.width *= this.gameObject.scale.x;
      this.options.height *= this.gameObject.scale.y;
      this.options.depth *= this.gameObject.scale.z;
    }

    // Đăng ký collider với Collision3DManager
    this.body = collision3DManager.registerCollider(this, this.options);

    // Tự động cập nhật vị trí body theo gameObject mỗi frame
    this._autoPositionHandler = this.autoPosition.bind(this);
    // gameLifecycle.update.addLateUpdate(this._autoPositionHandler);
    this.autoPosition();

    this.syncPosition();
    // this.syncRotation();
    this.syncQuaternion();
  }

  /**
   * Tự động cập nhật vị trí Body theo GameObject
   */
  autoPosition() {
    collision3DManager.updateColliderPosition(this.body, this.gameObject);
  }

  /**
   * Khi va chạm xảy ra
   */
  onTriggerEnter(other) {
    if (this.gameObject) {
      eventBus.emit(CoreEventType.COLLISION + this.gameObject.ID, other);
    }
  }

  onTriggerExit(other) {
    if (this.gameObject) {
      eventBus.emit(CoreEventType.COLLISION_EXIT + this.gameObject.ID, other);
    }
  }

  onTriggerStay(other) {
    if (this.gameObject) {
      eventBus.emit(CoreEventType.COLLISION_STAY + this.gameObject.ID, other);
    }
  }

  /**
   * Disable collider
   */
  _onDisable() {
    this.body.collisionResponse = false;
    this.body.collisionFilterGroup = 0;
    this.body.collisionFilterMask = 0;
    this.body.position.set(999999, 999999, 999999);
  }

  /**
   * Enable collider lại
   */
  _onEnable() {
    this._autoPositionHandler.call(this);
    this.body.collisionResponse = true;
    this.body.collisionFilterGroup = 1;
    this.body.collisionFilterMask = -1;
  }

  //#region binding sync

  syncPosition() {
    const self = this;
    const obj = this.gameObject;
    const body = this.body;

    // --- Three → Cannon (manual update) ---
    this.setPositionFromObject = () => {
      obj.updateMatrixWorld(true);
      const worldPos = new Vector3();
      obj.getWorldPosition(worldPos);
      body.position.copy(worldPos);
      body.velocity.set(0, 0, 0);
    };

    const worldPos = new Vector3();
    // --- Cannon → Three (after physics) ---
    this.updatePositionFromBody = () => {
      worldPos.set(body.position.x, body.position.y, body.position.z);
      if (obj.parent) {
        const localPos = obj.parent.worldToLocal(worldPos.clone());
        obj.position.copy(localPos);
      } else {
        obj.position.copy(worldPos);
      }
    };

    const originalSet = obj.position.set.bind(obj.position);
    obj.position.set = (x, y, z) => {
      originalSet(x, y, z);
      obj.updateMatrixWorld(true);

      const worldPos = new Vector3();
      obj.getWorldPosition(worldPos);

      body.position.copy(worldPos);
      body.velocity.set(0, 0, 0);
    };


    // --- Khi object được add vào scene ---
    obj.addEventListener("added", () => {
      queueMicrotask(() => this.setPositionFromObject());
    });

    // --- Đăng ký sync sau mỗi bước physics ---
    const updateSync = () => this.updatePositionFromBody();
    this._updatePositionSync = updateSync;
    gameLifecycle.update.addUpdate(this._updatePositionSync);

  }


  // syncRotation() {
  //   const self = this;
  //   const rot = this.gameObject.rotation;

  //   // --- Proxy rotation: Three → Cannon ---
  //   const proxyRot = new Proxy(rot, {
  //     set(target, prop, value) {
  //       target[prop] = value;

  //       if (['x', 'y', 'z'].includes(prop)) {
  //         // Khi xoay thủ công → cập nhật collider
  //         self.body.quaternion.setFromEuler(self.gameObject.rotation);
  //         self.body.angularVelocity.set(0, 0, 0); // reset để tránh Cannon phản lại
  //       }

  //       return true;
  //     },
  //     get(target, prop) {
  //       // Trả về giá trị thật, không tạo Euler tạm
  //       return target[prop];
  //     }
  //   });

  //   // --- Thay getter rotation của Three ---
  //   Object.defineProperty(this.gameObject, 'rotation', {
  //     get() {
  //       return proxyRot;
  //     },
  //     set(v) {
  //       rot.copy(v);
  //       self.body.quaternion.setFromEuler(rot);
  //       self.body.angularVelocity.set(0, 0, 0);
  //     }
  //   });

  //   // --- Hàm sync Cannon → Three mỗi frame ---
  //   this.updateRotationSync = () => {
  //     const q = self.body.quaternion;
  //     // Copy quaternion thật của body sang gameObject
  //     self.gameObject.quaternion.set(q.x, q.y, q.z, q.w);
  //     // Cập nhật rotation Euler để phản ánh đúng (Three tự cập nhật từ quaternion)
  //     self.gameObject.rotation.setFromQuaternion(self.gameObject.quaternion);
  //   };

  //   gameLifecycle.update.addUpdate(this.updateRotationSync);
  // }

  syncQuaternion() {
    const self = this;
    const quat = this.gameObject.quaternion;
    let isManualRotating = false;

    // 🔹 Three → Body
    function syncToBody() {
      if (!self.body) return;
      isManualRotating = true;
      self.body.quaternion.set(quat.x, quat.y, quat.z, quat.w);
      // ❌ KHÔNG reset angularVelocity mỗi lần set
      queueMicrotask(() => (isManualRotating = false)); // reset flag sau 1 tick
    }

    // 🔹 Body → Three
    function syncFromBody() {
      if (!self.body || isManualRotating) return;
      const bq = self.body.quaternion;
      quat.set(bq.x, bq.y, bq.z, bq.w);
      self.gameObject.rotation.setFromQuaternion(quat);
    }

    // ⚙️ Override các method thường được dùng khi xoay
    const methodsToSync = [
      'multiply',
      'multiplyQuaternions',
      'set',
      'copy',
      'slerp',
      'setFromAxisAngle',
      'setFromEuler',
    ];

    for (const methodName of methodsToSync) {
      const original = quat[methodName];
      if (typeof original !== 'function') continue;

      quat[methodName] = function (...args) {
        const result = original.apply(this, args);
        syncToBody();
        return result;
      };
    }

    // 🧩 Nếu gán quaternion trực tiếp
    Object.defineProperty(this.gameObject, 'quaternion', {
      get() {
        return quat;
      },
      set(v) {
        quat.copy(v);
        syncToBody();
      },
    });

    // 🔁 Sync Body → Three mỗi frame, nhưng chỉ đọc, không reset
    this.updateRotationSync = () => {
      syncFromBody();
    };

    gameLifecycle.update.addUpdate(this.updateRotationSync);
  }


  //#endregion

}
