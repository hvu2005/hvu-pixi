import { BehaviourSystem } from "./behaviour-system";
import { System } from "./system";


export class Scene {
    public behaviour: BehaviourSystem;

    public constructor() {
        this.behaviour = new BehaviourSystem();
    }

    private update(deltaTime: number): void {
        this.behaviour.update(deltaTime);
    }
}