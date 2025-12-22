import { Component } from "./base/Component";

/**
 * @abstract
 */
export class Transform extends Component {

    constructor() {
        super();
    }
    
    addChild(child) {
        throw new Error("Transform.addChild is not implemented.");
    }

    removeChild(child) {
        throw new Error("Transform.removeChild is not implemented.");
    }

    setPosition(...pos) {
        throw new Error("Transform.setPosition is not implemented.");
    }

    setRotation(...rotation) {
        throw new Error("Transform.setRotation is not implemented.");
    }

    setScale(...scale) {
        throw new Error("Transform.setScale is not implemented.");
    }

    setParent(parent) {
        throw new Error("Transform.setParent is not implemented.");
    }

    getPosition() {
        throw new Error("Transform.getPosition is not implemented.");
    }

    getRotation() {
        throw new Error("Transform.getRotation is not implemented.");
    }

    getScale() {
        throw new Error("Transform.getScale is not implemented.");
    }

    getParent() {
        throw new Error("Transform.getParent is not implemented.");
    }

    getChildren() {
        throw new Error("Transform.getChildren is not implemented.");
    }
    
}