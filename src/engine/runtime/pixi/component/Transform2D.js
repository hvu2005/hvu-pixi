import { Transform } from "engine/core/component/Transform";
import { Container } from "@pixi.alias";


export class Transform2D extends Transform {
    /**
     * @param {import("pixi.js").ContainerOptions} options 
     */
    constructor(options = {}) {
        super();
        const defaultOptions = {
            sortableChildren: true,
        }
        const mergedOptions = { ...defaultOptions, ...options };

        this.group = new Container(mergedOptions);
    }

    /**
     * @returns {Container}
     */
    getNode() {
        return this.group;
    }

    _onAttach() {

    }

    _onDestroy() {
        this.group.destroy();
        this.gameObject = null;
    }

    _onEnable() {
        this.group.visible = true;
    }

    _onDisable() {
        this.group.visible = false;
    }

    addRenderNode(node) {
        this.group.addChild(node);
    }

    removeRenderNode(node) {
        this.group.removeChild(node);
    }

    addChild(child) {
        this.group.addChild(child.getNode());
        this._children.push(child);
        child.parent = this;
    }

    /**
     * @param {Transform2D} child 
     */
    removeChild(child) {
        this.group.removeChild(child.getNode());
        this._children = this._children.filter(c => c !== child);
    }

    get position() {
        return this.group.position;
    }

    set position(position) {
        this.group.position.set(position.x, position.y);
    }

    get rotation() {
        return this.group.rotation;
    }

    set rotation(rotation) {
        this.group.rotation = rotation;
    }

    get scale() {
        return this.group.scale;
    }

    set scale(scale) {
        this.group.scale.set(scale.x, scale.y);
    }

    /**
     * @param {Transform2D} parent 
     */
    get parent() {
        return this._parent;
    }

    /**
     * @param {Transform2D} parent 
     */
    set parent(parent) {
        if(this._parent) {
            this._parent.removeChild(this);
        }

        this._parent = parent;
        this._parent.addChild(this);
    }

    /**
     * @returns {Transform2D[]}
     */
    get children() {
        return this._children;
    }
}