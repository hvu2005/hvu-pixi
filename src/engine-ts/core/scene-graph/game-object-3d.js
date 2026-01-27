import { Group, Mesh } from "three";





export class GameObject3D {
    constructor() {
        this.container = new Group();

        /**
         * @private
         * @type {GameObject3D}
         */
        this._children = [];

        this._position = {
            
        }

        this._rotation = {

        }

        this._scale = {

        }

        this.add = {
            mesh(asset, options) {
                const mesh = new Mesh(asset, options);
                this.container.add(mesh);
            },
        };

        this.get = {
            mesh() {
                return this.container.children.find(child => child instanceof Mesh);
            },
        }
    }

    /**
     * 
     * @param {GameObject3D} child 
     */
    addChild(child) {
        this._children.push(child);

        this.container.add(child.container);
    }

    setActive(isActive) {

    }
}