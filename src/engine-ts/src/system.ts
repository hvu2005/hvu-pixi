import { EventBus } from "./event-bus";

export class System<TEventMap extends Record<string, (...args: any[]) => void>> extends EventBus<TEventMap> {
    public constructor() {
        super();
    }

    public update(deltaTime: number): void {

    }
}