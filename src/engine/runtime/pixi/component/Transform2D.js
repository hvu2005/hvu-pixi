import { Transform } from "engine/core/component/Transform";
import { Container } from "@pixi.alias";


export class Transform2D extends Transform {
    constructor() {
        super();

        this.group = new Container();
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

    addChild(child) {
        this.group.addChild(child);
    }

    setPosition(x,y) {
        this.group.position.set(x,y);
    }

    setRotation(rotation) {
        this.group.rotation = rotation;
    }

    setScale(x,y) {
        this.group.scale.set(x,y);
    }

    getPosition() {
        return this.group.position;
    }

    getRotation() {
        return this.group.rotation;
    }

    getScale() {
        return this.group.scale;
    }

    getParent() {
        return this.group.parent;
    }

    setParent(parent) {
        this.group.parent = parent;
    }

    getChildren() {
        return this.group.children;
    }
}