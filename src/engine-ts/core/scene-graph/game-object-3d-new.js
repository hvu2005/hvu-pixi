import { Group, Mesh, Object3D } from "three";
import { Text3D } from "../extension-objects/text-3d";

export class GameObject3DNew {

    constructor() {

        /** 
         * @type { ObjectBase3D | null } 
         */
        this.object3D = null;

        /** 
         * @type {GameObject3DNew[]} 
         */
        this._children = [];

        this.active = true;

        const self = this;
        this.add = {
            mesh(geometry, material) {
                const mesh = new Mesh(geometry, material);
                return self._addObject(mesh);
            },

            text3D(font, options) {
                const text = new Text3D(font.texture, font.font, options);
                return self._addObject(text);
            }
            
        };
    }


    /**
     * @param {ObjectBase3D} node
     * @returns {ObjectBase3D}
     */
    _addObject(node) {
        node.gameObject = this;

        if (!this.object3D) {
            this.object3D = node;
            return node;
        }

        this.object3D.add(node);

        return node;
    }

    /**
     * @param {GameObject3DNew} child
     */
    addChild(child) {
        if (!child || !child.object3D) return;

        this._children.push(child);
        this.object3D.add(child.object3D);
    }

    setActive(isActive) {
        this.active = isActive;
        if (this.object3D) {
            this.object3D.visible = isActive;
        }
    }

    get children() {
        return this._children;
    }

    get position() {
        return this.object3D?.position;
    }

    get rotation() {
        return this.object3D?.rotation;
    }

    get scale() {
        return this.object3D?.scale;
    }
}


export class GameObject3D extends GameObject3DNew {
    constructor() {
        super();

        this.add.text3D();
        this.add.mesh();

        this.physics.add.boxCollider3d();
        this.action.add.animator();
        this.action.add.behaviour();
    }   
}