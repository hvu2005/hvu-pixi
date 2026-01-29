

export class EventEmitter {
    constructor() {
        this._events = {};
    }

    on(event, listener) {
        if (!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(listener);
        return () => this.off(event, callback);
    }

    off(event, listener) {
        if (!this._events[event]) return;
        if (!listener) {
            this._events[event] = [];
        } else {
            this._events[event] = this._events[event].filter(l => l !== listener);
        }
    }
    
    _emit(event, ...args) {
        if (!this._events[event]) return false;
        this._events[event].forEach(listener => {
            listener(...args);
        });
        return true;
    }
}