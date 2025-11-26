import { gameLifecycle } from "../../game/lifecycle/GameLifecyle";
import { system } from "./SystemRegister";



export class PreSystem {
    constructor() {
        system.regist(this);
    }

    init() {

    }
}