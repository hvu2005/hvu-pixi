import { Component } from "./base/component";



export class Behaviour extends Component {
    constructor() {
        super();
    }

    /**
    * @template T
    * @param {new (...args: any[]) => T} component
    * @returns {T | undefined}
    */
    getComponent(component) {
        return this.gameObject.getComponent(component);
    }

    /**
    * @template T
    * @param {T} component
    * @returns {T}
    */
    addComponent(component) {
        return this.gameObject.addComponent(component);
    }
}