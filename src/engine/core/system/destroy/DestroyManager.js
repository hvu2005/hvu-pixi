import gsap from "gsap";
import { CoreEventType } from "../../event/CoreEventType";
import { eventBus } from "../../event/EventBus";
import { PreSystem } from "../base/PreSystem";
import { Container } from "@pixi.alias";



class DestroyManager extends PreSystem {
    constructor() {
        super();
        this.destroyQueue = new Set();
    }

    async init() {

    }

    queueDestroy(gameObject) {
        this.destroyQueue.add(gameObject);
    }

    flushDestroy() {
        try {
            for (const go of this.destroyQueue) {
                eventBus.emit(CoreEventType.DESTROY + go.ID);
                eventBus.offSystem(CoreEventType.DESTROY + go.ID);
                if (go.parent) {
                    Container.prototype.removeChild.call(go.parent, go);
                }
                go.superDestroy();
            }
        }
        catch (e) {
            console.log(e);
        }
        this.destroyQueue.clear();
    }

    update(delta) {
        this.flushDestroy();
    }
}

export const destroyManager = new DestroyManager();