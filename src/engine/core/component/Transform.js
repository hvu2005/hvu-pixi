import { Component } from "./base/Component";

/**
 * @abstract
 */
export class Transform extends Component {

    constructor() {
        super();

        /**
         * @type {Transform}
         */
        this._parent = null; 
        /**
         * @type {Transform[]}
         */
        this._children = [];
    }
    
    addChild(child) {
        throw new Error("Transform.addChild is not implemented.");
    }

    removeChild(child) {
        throw new Error("Transform.removeChild is not implemented.");
    }

    addRenderNode(node) {
        throw new Error("Transform.addRenderNode is not implemented.");
    }

    removeRenderNode(node) {
        throw new Error("Transform.removeRenderNode is not implemented.");
    }

    get parent() {
        throw new Error("Transform.parent is not implemented.");
    }

    set parent(parent) {
        throw new Error("Transform.parent is not implemented.");
    }

    get children() {
        throw new Error("Transform.children is not implemented.");
    }

    get position() {
        throw new Error("Transform.position is not implemented.");
    }
    
    set position(position) {
        throw new Error("Transform.position is not implemented.");
    }

    get rotation() {
        throw new Error("Transform.rotation is not implemented.");
    }

    set rotation(rotation) {
        throw new Error("Transform.rotation is not implemented.");
    }

    get scale() {
        throw new Error("Transform.scale is not implemented.");
    }

    set scale(scale) {
        throw new Error("Transform.scale is not implemented.");
    }
    
}