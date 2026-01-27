import { GameObject3D, MonoBehaviour, instantiate } from "engine";
import { createInkSplash } from "scripts/model/InkSplash";
import { createProjectile } from "scripts/model/Projectile";


export class ObjectPool {
    constructor(createFunc, size = 10) {
        this.pool = [];
        this.createFunc = createFunc;
        this.size = size;
        this.onLoad();
    }

    async onLoad() {
        for (let i = 0; i < this.size; i++) {
            const obj = this.createFunc();
            obj.setActive(false);
            this.pool.push(obj);
        }
    }

    get() {
        const obj = this.pool.length > 0 ? this.pool.pop() : this.createFunc();
        obj.setActive(true);
        return obj;
    }

    release(obj) {
        obj.setActive(false);
        this.pool.push(obj);
    }
}


export function createPoolController() {
    const go = instantiate(GameObject3D, {
        components: [
            new PoolController(),
        ]
    })
    return go;
}

export class PoolController extends MonoBehaviour {

    /**
     * @type {PoolController}
     */
    static instance;

    awake() {
        PoolController.instance = this;

        this.pools = {};
    }

    start() {
        this.pools.projectile = new ObjectPool(() => createProjectile(), 100);
        this.pools.ink = new ObjectPool(() => createInkSplash(), 100);
    }

    /**
     * 
     * @param {string} name 
     * @returns {ObjectPool}
     */
    getPool(name) {
        return this.pools[name] ?? null;
    }
}