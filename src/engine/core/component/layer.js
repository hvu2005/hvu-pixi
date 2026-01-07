import { Component } from "./base/component";




export class Layer extends Component {
    constructor(order = 0) {
        super();

        this.order = order;
    }


}