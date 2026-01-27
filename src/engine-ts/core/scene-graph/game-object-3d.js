import { Group } from "three";





export class GameObject3D {
    constructor() {
        this.container = new Group();

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
}