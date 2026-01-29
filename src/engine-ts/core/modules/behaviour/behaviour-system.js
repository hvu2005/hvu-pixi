import { EventEmitter } from "engine-ts/core/event/event-emitter";

export class BehaviourSystem extends EventEmitter {
    static UPDATE = 'update';

    constructor() {
        super();

        this.add = {}
    }

    update(dt) {
        this._emit(BehaviourSystem.UPDATE, dt);
    }
}
