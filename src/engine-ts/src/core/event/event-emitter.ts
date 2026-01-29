type Listener<T extends any[]> = (...args: T) => void;

export class EventEmitter<TEventMap extends Record<string, any[]>> {
    private _events: {
        [K in keyof TEventMap]?: Listener<TEventMap[K]>[];
    } = {};

    on<K extends keyof TEventMap>(
        event: K,
        listener: Listener<TEventMap[K]>
    ): () => void {
        if (!this._events[event]) {
            this._events[event] = [];
        }

        this._events[event]!.push(listener);

        // unsubscribe function
        return () => this.off(event, listener);
    }

    off<K extends keyof TEventMap>(
        event: K,
        listener?: Listener<TEventMap[K]>
    ) {
        const listeners = this._events[event];
        if (!listeners) return;

        if (!listener) {
            delete this._events[event];
            return;
        }

        this._events[event] = listeners.filter(l => l !== listener);
    }

    _emit<K extends keyof TEventMap>(
        event: K,
        ...args: TEventMap[K]
    ): boolean {
        const listeners = this._events[event];
        if (!listeners?.length) return false;

        // clone để tránh bug khi listener remove chính nó
        [...listeners].forEach(l => l(...args));
        return true;
    }

    once<K extends keyof TEventMap>(
        event: K,
        listener: Listener<TEventMap[K]>
    ) {
        const wrapper: Listener<TEventMap[K]> = (...args) => {
            listener(...args);
            this.off(event, wrapper);
        };

        this.on(event, wrapper);
    }

    clear() {
        this._events = {};
    }
}
