

export class GameStart {
    constructor() {
        this.starts = [];
    }

    async start() {
        while (this.starts.length > 0) {
            const { fn, context } = this.starts.shift();

            if (context && typeof fn === 'function') {
                await fn.call(context);
            }
        }
        this.hasStarted = true;
    }

    addStart(fn, context = null) {
        if (this.hasStarted) {
            if (context && typeof fn === 'function') {
                fn.call(context);
            }
        }
        else {
            this.starts.push({ fn, context });
        }

    }
}
