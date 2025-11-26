import { gameLifecycle } from "../../game/lifecycle/GameLifecyle";
import { PostSystem } from "./PostSystem";
import { PreSystem } from "./PreSystem";



export class SystemRegister {
    constructor() {
        this.postSystems = [];
        this.preSystems = [];
    }


    async __init() {
        for (const sys of this.postSystems) {
            await sys.init();
            gameLifecycle.update.addPostSystem(sys);
        }

        for (const sys of this.preSystems) {
            await sys.init();
            gameLifecycle.update.addPreSystem(sys);
        }
    }

    regist(system) {
        switch (true) {
            case system instanceof PreSystem:
                this.preSystems.push(system);
                break;
            case system instanceof PostSystem:
                this.postSystems.push(system);
                break;
            default:
                break;
        }
    }


}

export const system = new SystemRegister();