import { GameObject } from "../../../shared/objects/objects.d";
import { PostSystem } from "../base/PostSystem";

class MonoManager extends PostSystem {
    constructor() {
        super();
        this.monoComps = new Set();
    }

    async init() { }

    registQueue(mono) {
        this.monoComps.add(mono);
    }

    // Ép init ngay nếu cần
    ensureInit(mono) {
        if (this.monoComps.has(mono)) {
            this.monoComps.delete(mono);
            mono.__initMono?.();
        }
    }

    update(delta) {
        //this.flushQueue();
    }

    flushQueue() {
        if (this.monoComps.size <= 0) return;
        const all = Array.from(this.monoComps);
        this.monoComps.clear();
        Promise.resolve().then(() => {
            for (const mono of all) {
                mono.__initMono?.();
            }
        });
    }

    /**
     * Gọi sau khi GameObject.attachComponents()
     * @param {GameObject} gameObject
     */
    initObject(gameObject) {
        for (const comp of gameObject.components.values()) {
            if (comp.__isMono && !comp._inited) {
                comp._inited = true;   // gắn cờ để không init 2 lần
                comp.__initMono?.();   // gọi hàm init nội bộ
            }
        }

        // init luôn cho các con (đệ quy)
        for (const child of gameObject.gameChildren) {
            if (child.attachComponents) {
                this.initObject(child);
            }
        }
    }
}

export const monoManager = new MonoManager();