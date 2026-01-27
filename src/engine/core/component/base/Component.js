import { GameObject } from "engine/core/scene-graph/game-object";
import { EventBus } from "engine/core/event/event-bus";

/**
 * @abstract
 */
export class Component {
    static requiredComponents = [];

    constructor() {
        /**
         * @template {GameObject} T
         * @type {T}
         */
        this.gameObject = undefined;

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

    /**
    * @protected
    */
    _initProperties(properties = {}) {
        const metaProps = this.constructor.__properties__;
        if (!metaProps) return;

        for (const key in metaProps) {
            // Skip if property is not provided in properties object
            if (!(key in properties)) continue;

            const meta = metaProps[key];
            const value = properties[key];

            // Type validation
            if (typeof meta.type === 'string' && typeof value !== meta.type) {
                console.warn(`[${this.constructor.name}] Invalid property "${key}", expected ${meta.type}, got`, typeof value);
                continue;
            }
            else if (typeof meta.type === 'function' && !(value instanceof meta.type)) {
                console.warn(`[${this.constructor.name}] Invalid property "${key}", expected ${meta.type.name}, got`, value?.constructor?.name || typeof value);
                continue;
            }

            this[key] = value;
        }
    }

    /**
     * 
     * @template T
     * @param {new (...args: any[]) => T} component
     * @returns {T | undefined}
     */
    getComponent(component) {
        return this.gameObject.getComponent(component);
    }

    /**
     * 
     * @param {Component} component 
     */
    addComponent(component) {
        this.gameObject.addComponent(component);
    }


    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        if (this._enabled === value) return;
        this._enabled = value;
        value ? this._onEnable() : this._onDisable();
    }

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