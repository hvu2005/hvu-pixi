


export class GameAwake {
    constructor() {
        this.awakes = [];
    }

    async awake() {

    }

    async addAwake(fn, context = null) {
        if (context && typeof fn === 'function') {
            fn.call(context);
        }
    }

}