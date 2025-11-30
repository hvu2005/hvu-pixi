import { System } from "../base/System";

class BehaviourSystem extends System {
    async init() {
        console.log("BehaviourSystem init");

        this.behaviours = [];           // active behaviours
        this.behaviourQueue = [];       // behaviours mới thêm
        this.removeQueue = new Set();   // behaviours xóa
    }

    update(dt) {
        // Xử lý behaviours mới
        if (this.behaviourQueue.length > 0) {
            for (let i = 0; i < this.behaviourQueue.length; i++) {
                const b = this.behaviourQueue[i];
                this.behaviours.push(b);
                b.start();
            }
            this.behaviourQueue.length = 0; // clear array nhanh
        }

        // Update behaviours
        const behaviours = this.behaviours;
        for (let i = 0; i < behaviours.length; i++) {
            const b = behaviours[i];
            if (!b.entity?.activeSelf || !b.enabled) continue;
            b.update(dt);
        }

        // Xử lý behaviours remove
        if (this.removeQueue.size > 0) {
            let j = 0;
            for (let i = 0; i < behaviours.length; i++) {
                const b = behaviours[i];
                if (this.removeQueue.has(b)) continue;
                behaviours[j++] = b;
            }
            behaviours.length = j;
            this.removeQueue.clear();
        }
    }

    addBehaviour(behaviour) {
        this.behaviourQueue.push(behaviour);
        behaviour.awake();
    }

    removeBehaviour(behaviour) {
        this.removeQueue.add(behaviour);
    }
}

export const behaviourSystem = new BehaviourSystem();
