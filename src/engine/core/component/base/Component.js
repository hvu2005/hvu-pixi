import { GameObject } from "engine/core/entity/GameObject";

/**
 * @abstract
 */
export class Component {
    constructor() {
        /**
         * @type {GameObject}
         */
        this.gameObject = null;

        /**
         * @private
         */
        this._enabled = true;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        if (this._enabled === value) return;
        this._enabled = value;
        value ? this._onEnable() : this._onDisable();
    }

    /**
     * @param {GameObject} gameObject
     */
    attach(gameObject) {
        this.gameObject = gameObject;
        this._onAttach();
    }

    destroy() {
        this.gameObject = null;
        this._onDestroy();
    }
    
    getNode() {
        console.warn(`Component ${this.constructor.name} does not implement getNode method.`);
        return null;
    }
    
    /**
     * @protected
     */
    _onAttach() {
   
    }
    /**
     * @protected
     */
    _onDestroy() {

    }

    /**
     * @protected
     */
    _onEnable() {

    }
    /**
     * @protected
     */
    _onDisable() {

    }
}