import { behaviourSystem } from "engine/core/systems/behaviour/BehaviourSystem";
import { Component } from "../base/Component";
import { SpriteRenderer } from "../renderer/SpriteRenderer";





export class Behaviour extends Component {
    async init() {
        behaviourSystem.addBehaviour(this);
    }

    get transform() {
        return this.entity.transform;
    }

    awake() {

    }

    start() {

    }
    
    update(dt) {

    }
}