import { Component } from "../base/Component";



export class Transform2D extends Component {
    async init() {
        this.entity.transform = this;

        this.children = [];
        this.parent = null;

        const self = this; // <-- capture instance
        this._position = {
            set(x, y) {
                if (self.node) self.node.position.set(x, y);
            },
            get x() {
                return self.node.position.x;
            },
            get y() {
                return self.node.position.y;
            }
        };


        this._scale = {
            set(x, y) {
                self.node.scale.set(x, y);
            },
            get x() {
                return self.node.scale.x;
            },
            get y() {
                return self.node.scale.y;
            }
        };
    }

    get node() {
        return this.entity.container ?? this.entity.renderer;
    }

    get position() {
        return this._position;
    }

    get rotation() {
        return this.node.rotation;
    }

    set rotation(value) {
        this.node.rotation = value;
    }

    get scale() {
        return this._scale;
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;

        this.node.addChild(child.node);
    }

    getGlobalPosition() {
        return this.node.getGlobalPosition();
    }

    toLocal(globalPosition) {
        return this.node.toLocal(globalPosition);
    }

}   