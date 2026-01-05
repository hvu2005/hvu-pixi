import { Behaviour } from "engine/core/component/behaviour";




export class MonoBehaviour extends Behaviour {

    awake() {}

    start() {}

    update(dt) {}

    _onAttach() {
        this.awake();
    }
    
}