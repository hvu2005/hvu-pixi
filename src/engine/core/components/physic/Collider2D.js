import { Body, Events } from "matter-js";
import { Component } from "../base/Component";
import { physic2DSystem } from "engine/core/systems/physic/Physic2DSystem";





export class Collider2D extends Component {
    constructor(options = {}) {
        super();

        this.options = {
            x: options.x || 0,
            y: options.y || 0,
            isStatic: options.isStatic || false,
            isSensor: options.isSensor || false,
        }
    }

    async init() {
        this.body = this._createBody();
        physic2DSystem.addCollider(this);
    }

    _createBody() {

    }

    _onDestroy() {

    }

    _onEnable() {

    }

    _onDisable() {

    }
}