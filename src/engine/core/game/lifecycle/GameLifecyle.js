
import { GameAwake } from "./GameAwake";
import { GameStart } from "./GameStart";
import { GameUpdate } from "./GameUpdate";


export class GameLifecycle {
    constructor() {
    }

    async __init() {
        this.update = new GameUpdate();
        this.start = new GameStart();
        this.awake = new GameAwake();

        await this.runLifecycle();
    }

    async runLifecycle() {
        await this.awake.awake();
        await this.start.start();
        this.update.run();
    }


    //#region add'er

    addUpdate(fn, context) {
        this.update.addUpdate(fn, context);
    }

    addLateUpdate(fn, context) {
        this.update.addLateUpdate(fn, context);
    }

    removeUpdate(context) {
        this.update.removeUpdate(context.update, this);
    }

    addStart(fn, context) {
        this.start.addStart(fn, context);
    }

    addAwake(fn, context) {
        this.awake.addAwake(fn, context);
    }
    //#endregion
}

export const gameLifecycle = new GameLifecycle();
