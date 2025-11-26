import { GameObject } from "../../shared/objects/objects.d";


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
