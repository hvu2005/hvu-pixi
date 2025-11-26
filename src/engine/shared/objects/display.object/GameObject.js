import { Container } from "@pixi.alias";
import { CoreEventType, eventBus, container2D } from "../../../core/core.d";
import { destroyManager } from "../../../core/system/destroy/DestroyManager";
import gsap from "gsap";
import { monoManager } from "../../../core/system/mono/MonoManager";


export class GameObject extends Container {
    constructor(options = { label: `GameObject_${GameObject.allGameObject.length}`, layer: 1, tag: "none" }) {
        super();
        const defaultOptions = {
            label: options.label ?? `GameObject_${GameObject.allGameObject.length}`,
            layer: options.layer ?? Layer.DEFAULT,
            tag: options.tag ?? "none"
        };

        //lock id
        Object.defineProperty(this, "ID", {
            value: `GO_${GameObject._nextId++}`,
            writable: false,
            configurable: false,
            enumerable: true
        });

        this.label = options.label;
        this.components = new Map();
        this.options = defaultOptions;
        this.tag = this.options.tag;
        this.layer = this.options.layer;
        this._renderer = new Container();
        this._renderer.label = "[renderer]";

        this._activeSelf = true;
        this._inheritedActive = true;

        this.__isInited = false;
    }

    attachComponents() {

    }

    hierachy() {

    }

    __init() {
        GameObject.allGameObject.push(this);
        Container.prototype.addChild.call(this, this._renderer);

        //core event
        eventBus.onSystem(CoreEventType.ACTIVE_CHANGE + this.ID, (isActive) => {
            if (!isActive) {
                gsap.killTweensOf(this);
            }
        });

        this.attachComponents();
        this.hierachy();

        if (!(this.parent instanceof GameObject) || this.parent.__isInited) {
            monoManager.initObject(this);
        }

        this.__isInited = true;
    }

    setActive(value) {
        if (this._activeSelf === value) return;
        this._activeSelf = value;
        this.visible = this.activeInHierarchy;
        eventBus.emit(CoreEventType.ACTIVE_CHANGE + this.ID, this.activeInHierarchy);
    }

    _setInheritedActive(value) {
        if (this._inheritedActive === value) return;
        this._inheritedActive = value;
        this.visible = this.activeInHierarchy;
        eventBus.emit(CoreEventType.ACTIVE_CHANGE + this.ID, this.activeInHierarchy);
    }

    /**
     * @override
     * @param  {...any} children 
     */
    addChild(...children) {
        for (const child of children) {
            eventBus.emit(CoreEventType.ADD_CHILD + this.ID, child);

            if (child.parent && child.parent !== this) {
                Container.prototype.removeChild.call(child.parent, child);
            }

            if (child instanceof GameObject) {
                const handler = (isActive) => child._setInheritedActive(isActive);
                child._inheritedActiveHandler = handler;
                eventBus.onSystem(CoreEventType.ACTIVE_CHANGE + this.ID, handler);

                child._setInheritedActive(this.activeInHierarchy);
                child.layer = this.options.layer;
            }
        }
        super.addChild(...children);
        return children;
    }

    /**
     * @override
     * @param  {...any} children 
     */
    removeChild(...children) {
        for (const child of children) {
            eventBus.emit(CoreEventType.REMOVE_CHILD + this.ID, child);

            if (child instanceof GameObject && this instanceof GameObject) {

                eventBus.offSystem(CoreEventType.ACTIVE_CHANGE + this.ID, child);
                child._setInheritedActive(true); // reset về mặc định
            }
        }

        Container.prototype.removeChild.call(this, ...children);
        container2D.addToScene(...children, { layer: this.layer, tag: this.tag });

        return children;
    }

    /**
     * 
     * @param {Component} component 
     * @returns 
     */
    addComponent(component) {
        const key = component.constructor.name;
        if (this.components.has(key)) {
            // console.log(key + " da ton tai trong " + this.name);
            return this.components.get(key);
        }

        component.create(this);
        this.components.set(key, component);

        if (this.__isInited) {
            monoManager.initObject(this);
        }


        return component;
    }

    /**
     * 
     * @param {Component} component 
     * @returns 
     */
    getComponent(component) {
        const key = component.name;
        if (this.components.has(key)) {
            return this.components.get(key);
        }
        for (const comp of this.components.values()) {
            if (comp instanceof component) {
                return comp;
            }
        }
        return null;
    }

    /**
     * 
     * @param {Component} component 
     * @returns
     */
    getComponentInChild(component) {
        for (const child of this.gameChildren) {
            const found = child.getComponent?.(component);
            if (found) return found;
        }
        return null;
    }

    /**
     * 
     * @param {Component} component 
     * @returns 
     */
    getComponentInParent(component) {
        let current = this.parent;
        while (current) {
            const found = current.getComponent?.(component);
            if (found) return found;
            current = current.parent;
        }
        return null;
    }

    /**
     * 
     * @param {Component} component 
     */
    removeComponent(component) {
        const key = component.name;
        if (this.components.has(key)) {
            this.components.delete(key);
        }
    }


    destroy() {
        gsap.killTweensOf(this);
        this.gameChildren.forEach(child => {
            child.destroy();
        });
        destroyManager.queueDestroy(this);
    }

    superDestroy() {
        Container.prototype.destroy.call(this);
    }

    //#region static
    static allGameObject = [];
    static _nextId = 0;

    static findGameObjectsWithTag(tag) {
        return GameObject.allGameObject.filter(go => go.tag === tag);
    }

    static instantiate(goClass, parent = null) {
        const instance = new goClass();

        if (parent instanceof GameObject) {
            parent.addChild(instance);
        }
        else {
            container2D.addToScene(instance, { layer: instance.layer });
        }

        instance.__init();

        return instance;
    }
    //#endregion

    //#region getter setter
    get gameChildren() {
        return this.children.filter(c => c !== this._renderer);
    }
    getChildAt(index) {
        return this.gameChildren[index] || null;
    }

    getChildIndex(child) {
        return this.gameChildren.indexOf(child);
    }

    get activeSelf() {
        return this.visible;
    }

    get activeInHierarchy() {
        return this._activeSelf && this._inheritedActive;
    }

    get layer() {
        return this.options.layer;
    }

    set layer(value) {
        if (this.parent instanceof GameObject) return;
        this.options.layer = value;
        container2D.getLayer(value).removeChild(this);
        container2D.addToScene(this, { layer: value });
    }

    //#endregion
}