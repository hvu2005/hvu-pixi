
import { Group } from '@three.alias';

import { CoreEventType, eventBus, container3D } from "../../../core/core.d";
import { destroyManager } from "../../../core/system/destroy/DestroyManager";
import { monoManager } from "../../../core/system/mono/MonoManager";
import gsap from "gsap";

export class GameObject3D extends Group {
    constructor(options = { label: `GameObject3D_${GameObject3D.allGameObject.length}`, tag: "none" }) {
        super();

        const defaultOptions = {
            label: options.label ?? `GameObject3D_${GameObject3D.allGameObject.length}`,
            tag: options.tag ?? "none"
        };

        // Lock ID
        Object.defineProperty(this, "ID", {
            value: `GO3D_${GameObject3D._nextId++}`,
            writable: false,
            configurable: false,
            enumerable: true
        });

        this.label = defaultOptions.label;
        this.tag = defaultOptions.tag;

        this.components = new Map();
        this._renderer = new Group();
        this.options = defaultOptions;

        this._activeSelf = true;
        this._inheritedActive = true;

        this.__isInited = false;
    }

    attachComponents() {}
    hierachy() {}

    __init() {
        GameObject3D.allGameObject.push(this);
        this.add(this._renderer);

        // Listen active state change
        eventBus.onSystem(CoreEventType.ACTIVE_CHANGE + this.ID, (isActive) => {
            if (!isActive) {
                gsap.killTweensOf(this);
            }
        });

        this.attachComponents();
        this.hierachy();

        if (!(this.parent instanceof GameObject3D) || this.parent.__isInited) {
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
     */
    addChild(...objects) {
        for (const obj of objects) {
            eventBus.emit(CoreEventType.ADD_CHILD + this.ID, obj);

            if (obj.parent && obj.parent !== this) {
                obj.parent.remove(obj);
            }

            if (obj instanceof GameObject3D) {
                const handler = (isActive) => obj._setInheritedActive(isActive);
                obj._inheritedActiveHandler = handler;
                eventBus.onSystem(CoreEventType.ACTIVE_CHANGE + this.ID, handler);

                obj._setInheritedActive(this.activeInHierarchy);
            }
        }
        this.add(...objects);
        return objects;
    }

    /**
     * @override
     */
    removeChild(...objects) {
        for (const obj of objects) {
            eventBus.emit(CoreEventType.REMOVE_CHILD + this.ID, obj);

            if (obj instanceof GameObject3D) {
                eventBus.offSystem(CoreEventType.ACTIVE_CHANGE + this.ID, obj._inheritedActiveHandler);
                obj._setInheritedActive(true); // reset về mặc định
            }
        }

        this.remove(...objects);
        return objects;
    }

    addComponent(component) {
        const key = component.constructor.name;
        if (this.components.has(key)) {
            return this.components.get(key);
        }

        component.create(this);
        this.components.set(key, component);

        if (this.__isInited) {
            monoManager.initObject(this);
        }

        return component;
    }

    getComponent(component) {
        const key = component.name;
        if (this.components.has(key)) {
            return this.components.get(key);
        }
        for (const comp of this.components.values()) {
            if (comp instanceof component) return comp;
        }
        return null;
    }

    getComponentInChild(component) {
        for (const child of this.children) {
            const found = child.getComponent?.(component);
            if (found) return found;
        }
        return null;
    }

    getComponentInParent(component) {
        let current = this.parent;
        while (current) {
            const found = current.getComponent?.(component);
            if (found) return found;
            current = current.parent;
        }
        return null;
    }

    removeComponent(component) {
        const key = component.name;
        if (this.components.has(key)) {
            this.components.delete(key);
        }
    }

    destroy() {
        gsap.killTweensOf(this);
        this.children.forEach(child => {
            if (child.destroy) child.destroy();
        });
        destroyManager.queueDestroy(this);
    }

    superDestroy() {
        Group.prototype.removeFromParent.call(this);
        this.clear();
    }

    //#region static
    static allGameObject = [];
    static _nextId = 0;

    static findGameObjectsWithTag(tag) {
        return GameObject3D.allGameObject.filter(go => go.tag === tag);
    }

    static instantiate(goClass, parent = null) {
        const instance = new goClass();

        if (parent instanceof GameObject3D) {
            parent.addChild(instance);
        }
        else {
            container3D.addToScene(instance);
        }

        instance.__init();
        return instance;
    }
    //#endregion

    //#region getter setter
    get gameChildren() {
        return this.children;
    }

    get activeSelf() {
        return this._activeSelf;
    }

    get activeInHierarchy() {
        return this._activeSelf && this._inheritedActive;
    }
    //#endregion
}
