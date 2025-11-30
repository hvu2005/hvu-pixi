
import { Entity2D } from "engine/core/entities/Entity2D";
import { Body } from "matter-js";

export class Component {
    constructor() {
        this._enabled = true;
    }

    async init() {
        
    }

    create(entity) {
        /**
         * @type {Entity2D}
         */
        this.entity = entity;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {    
        if(this._enabled === value) return;
        this._enabled = value;
        if(!this.entity?.activeSelf) return;
        
        if(value) {
            this._onEnable();
        }
        else {
            this._onDisable();
        }
    }

    _onEnable() {

    }

    _onDisable() {

    }

    _onDestroy() {

    }
}