
import { CoreEventType, eventBus, gameLifecycle } from "@engine";
import { Component } from "../base/Component";
import { monoManager } from "../../../core/system/mono/MonoManager";

import { Sprite } from "@pixi.alias";
import { RendererBase } from "@engine";
import { appEngine } from "engine/core/runtime/AppEngine";



export class MonoBehaviour extends Component {
    constructor(serializeProps = {}) {
        super();
        monoManager.registQueue(this);
        this.__isMono = true;
        this.__serializeProps = serializeProps;
    }

    /**
     * Map config truyền từ ngoài vào những field có @SerializeField
     * @param {Object} serializeProps 
     */
    __applyConfig(serializeProps = {}) {
        const fields = this.__serializedFields || [];
        for (const key of fields) {
            if (serializeProps[key] !== undefined) {
                this[key] = serializeProps[key];
            }
        }
    }

    __init() {
        this.awake();

        // this.__interact = "none";
        // this.__applyConfig(this.__serializeProps);
        // // gameLifecycle.addAwake(this.awake, this);
        // gameLifecycle.addStart(this.start, this);
        // gameLifecycle.addUpdate(this.update, this);
        // gameLifecycle.addLateUpdate(this.lateUpdate, this);

        // this.__monoRegisterEvents();
    }

    __initMono() {
        this.__interact = "none";
        this.__applyConfig(this.__serializeProps);
        // gameLifecycle.addAwake(this.awake, this);
        gameLifecycle.addStart(this.start, this);
        gameLifecycle.addUpdate(this.update, this);
        gameLifecycle.addLateUpdate(this.lateUpdate, this);

        this.__monoRegisterEvents();
    }

    get interact() {
        return this.__interact;
    }

    set interact(mode) {
        if (this.__interact === mode) return;
        this.__interact = mode;

        const sprite = this.gameObject?.getComponent(RendererBase)?.sprite;
        if (!sprite || !(sprite instanceof Sprite)) return;

        // reset mọi thứ trước
        sprite.removeAllListeners();
        sprite.cursor = null;

        if (mode === "none") {
            sprite.eventMode = "none";   // không bắt sự kiện
            return;                      // thoát sớm, không bind gì hết
        }

        // có tương tác thì bind
        sprite.eventMode = mode;         // "static" | "auto" | "passive"
        sprite.cursor = "pointer";

        sprite.on("pointerdown", (e) => {
            this.onPointerDown(e);

            const APP = appEngine.pixi.stage;
            // bật stage để drag
            APP.stage.eventMode = "static";
            APP.stage.hitArea = APP.screen;

            APP.stage.on("pointermove", this.onPointerDrag, this);

            const onStagePointerUp = (ev) => {
                this.onPointerUp(ev);

                // gỡ listener stage sau khi release
                APP.stage.off("pointermove", this.onPointerDrag, this);
                APP.stage.off("pointerup", onStagePointerUp);
                APP.stage.off("pointerupoutside", onStagePointerUp);
            };

            APP.stage.on("pointerup", onStagePointerUp);
            APP.stage.on("pointerupoutside", onStagePointerUp);
        }, this);
    }





    setProperties(serializeProps = {}) {
        this.__applyConfig(serializeProps);
    }

    // xu li noi bo
    __monoRegisterEvents() {
        eventBus.onSystem(CoreEventType.ADD_CHILD + this.gameObject.ID, (child) => {
            this._onAddChild?.(child);
        })

        eventBus.onSystem(CoreEventType.REMOVE_CHILD + this.gameObject.ID, (child) => {
            this._onRemoveChild?.(child);
        })

        eventBus.onSystem(CoreEventType.COLLISION + this.gameObject.ID, (other) => {
            this.onTriggerEnter?.(other);
        });

        eventBus.onSystem(CoreEventType.COLLISION_STAY + this.gameObject.ID, (other) => {
            this.onTriggerStay?.(other);
        });

        eventBus.onSystem(CoreEventType.COLLISION_EXIT + this.gameObject.ID, (other) => {
            this.onTriggerExit?.(other);
        });

        eventBus.onSystem(CoreEventType.ACTIVE_CHANGE + this.gameObject.ID, (isActive) => {
            if (isActive) this.onEnable();
            else this.onDisable();
        })

        eventBus.onSystem(CoreEventType.ON_RESIZE, this.onResize, this);
    }


    //logic di kem gameObject

    setActive(bool) {
        this.gameObject.setActive(bool);
    }

    /**
     * 
     * @param {Component} component 
     * @returns 
     */
    addComponent(component) {
        return this.gameObject.addComponent(component);
    }

    /**
     * 
     * @param {Component} component 
     * @returns 
     */
    getComponent(component) {
        return this.gameObject.getComponent(component);
    }

    /**
     * 
     * @param {Component} component 
     * @returns 
     */
    getComponentInChild(component) {
        return this.gameObject.getComponentInChild(component);
    }

    /**
     * 
     * @param {Component} component 
     * @returns 
     */
    getComponentInParent(component) {
        return this.gameObject.getComponentInParent(component);
    }

    /**
     * 
     * @param {Component} component 
     */
    removeComponent(component) {
        this.gameObject.removeComponent(component);
    }

    destroy(gameObject = this.gameObject) {
        gameObject.destroy();
    }
    //#region collision

    onTriggerEnter(other) {

    }

    onTriggerExit(other) {

    }

    onTriggerStay(other) {

    }

    //#endregion

    //#region game life cycle

    async awake() {

    }

    async start() {

    }

    update(delta) {

    }

    lateUpdate(delta) {

    }

    //#endregion

    //#region event

    onPointerDown() {

    }

    onPointerDrag() {

    }

    onPointerUp() {

    }

    onEnable() {

    }

    onDisable() {

    }

    onResize(width, height) {

    }


    /**
     * @override
     */
    _onDestroy() {
        super._onDestroy();
        gameLifecycle.removeUpdate(this.update, this);
    }

    /**
     * @override
     */
    _onEnable() {

    }

    /**
     * @override
     */
    _onDisable() {

    }

    _onAddChild(child) {

    }

    _onRemoveChild(child) {

    }

    //#endregion

    //#region static
    static findGameObjectsWithTag(tag) {
        return this.gameObject.allGameObject.filter(go => go.tag === tag);
    }

    //#endregion
}