import { Container } from "pixi.js";
import { Component } from "../base/Component";





export class Transform extends Component {
    #container;
    #position;
    #rotation;
    #scale;

    async init() {
        await super.init();
        this.#container = new Container();
        Object.setPrototypeOf(this, this.#container);
    }

}