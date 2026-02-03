import { System } from "./system";

type BehaviourEventMap = {
    update: (deltaTime: number) => void;
};

export class BehaviourSystem extends System<BehaviourEventMap> {
    constructor() {
        super();
    }

    public update(deltaTime: number): void {
        this.emit('update', deltaTime);
    }
}
