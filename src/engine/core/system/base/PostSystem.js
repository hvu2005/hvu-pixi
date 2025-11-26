import { gameLifecycle } from "../../game/lifecycle/GameLifecyle";
import { system } from "./SystemRegister";



export class PostSystem {
    constructor() {
        system.regist(this);
    }

    init() {
        // console.log("chua co ham init o class " + this.constructor.name);
    }
}