import { EventEmitter } from "../../event/event-emitter";

type BehaviourSystemEventMap = {
    'update': [number];
};

export class BehaviourSystem extends EventEmitter<BehaviourSystemEventMap> {
    constructor() {
        super();

    }

    update(dt: number) {
        this._emit('update', dt);
    }
}
