import { GameObject } from "engine/core/scene-graph/game-object";
import { EventBus } from "engine/core/event/event-bus";

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

        /**
         * @protected
         * @type {EventBus}
         */
        this._eventBus = new EventBus();
    }

    on(event, callback) {
        return this._eventBus.on(event, callback);
    }

    off(event, callback) {
        this._eventBus.off(event, callback);
    }

    /**
     * @protected
     * @param {string} event 
     * @param  {...any} args 
     */
    _emit(event, ...args) {
        this._eventBus.emit(event, ...args);
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