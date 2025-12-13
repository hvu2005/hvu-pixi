import { behaviourSystem } from "engine/core/systems/behaviour/BehaviourSystem";
import { Component } from "../base/Component";
import { world } from "engine/core/World";
import { eventBus } from "engine/core/event/EventBus";
import { CoreEventType } from "engine/core/event/CoreEventType";






export class Behaviour extends Component {

    //#region INIT
    async init() {
        behaviourSystem.addBehaviour(this);
        this.entity.behaviours.push(this);

        this._eventMode = 'none';
        this._registEvents();
    }

    _registEvents() {
        eventBus.onSystem(CoreEventType.ON_COLLISION_ENTER, this.onCollisionEnter, this);
    }

    //#endregion

    //#region GETTER SETTER

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
    
    //#endregion

    //#region EVENTS

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

    onCollisionEnter(other) {

    }

    onCollisionExit(other) {

    }

    onCollisionStay(other) {

    }

    _onDestroy() {
        eventBus.clearSystem(this);
    }

    _onEnable() {

    }
    
    _onDisable() {

    }

    //#endregion

}