import { Behaviour } from "engine/core/component/Behaviour";




export class MonoBehaviour extends Behaviour {

    awake() {}

    start() {}

    update(dt) {}

    _onAttach() {
        this.awake();
    }
    
}