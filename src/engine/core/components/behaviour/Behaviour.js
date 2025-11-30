import { behaviourSystem } from "engine/core/systems/behaviour/BehaviourSystem";
import { Component } from "../base/Component";
import { SpriteRenderer } from "../renderer/SpriteRenderer";
import { world } from "engine/core/World";





export class Behaviour extends Component {
    async init() {
        behaviourSystem.addBehaviour(this);

        this._eventMode = 'none';
    }

    set eventMode(mode) {
        if(this._eventMode === mode) return;
        this._eventMode = mode;

        const sprite = this.entity.renderer;
        
        if(!sprite?.eventMode) return;

        sprite.eventMode = mode;
        sprite.removeAllListeners();
        sprite.cursor = "pointer";

        sprite.on("pointerdown", (e) => {
            this.onPointerDown(e);

            const pixi = world.pixi;
            // bật stage để drag

            pixi.stage.on("pointermove", this.onPointerMove, this);

            const onStagePointerUp = (ev) => {
                this.onPointerUp(ev);

                // gỡ listener stage sau khi release
                pixi.stage.off("pointermove", this.onPointerMove, this);
                pixi.stage.off("pointerup", onStagePointerUp);
                pixi.stage.off("pointerupoutside", onStagePointerUp);
            };

            pixi.stage.on("pointerup", onStagePointerUp);
            pixi.stage.on("pointerupoutside", onStagePointerUp);
        }, this);

        sprite.on("pointerover", this.onPointerOver, this);
    }

    get eventMode() {
        return this._eventMode;
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

    onPointerDown(event) {

    }

    onPointerUp(event) {

    }

    onPointerMove(event) {

    }

    onPointerOver(event) {
        
    }

    onTriggerEnter(collision) {

    }

    onTriggerExit(collision) {

    }

    onTriggerStay(collision) {

    }

}