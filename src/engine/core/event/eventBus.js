class EventBus {
    constructor() {
        this.events = new Map();
        this.systemEvents = new Map();
    }

    getSet(event) {
        if (!this.events.has(event)) this.events.set(event, new Set());
        return this.events.get(event);
    }

    getSystemSet(event) {
        if (!this.systemEvents.has(event)) this.systemEvents.set(event, new Set());
        return this.systemEvents.get(event);
    }

    onSystem(event, fn, ctx = null) {
        const set = this.getSystemSet(event);
        if (set) set.add({ fn, ctx });
    }

    on(event, fn, ctx = null) {
        const set = this.getSet(event);
        if (set) set.add({ fn, ctx });
    }

    off(event, fn, ctx = null) {
        const set = this.getSet(event);
        if (set) set.delete({ fn, ctx });
    }

    emit(event, ...args) {
        const set = this.getSet(event);
        const systemSet = this.getSystemSet(event);
        if (set) set.forEach(item => item.fn.call(item.ctx, ...args));
        if (systemSet) systemSet.forEach(item => item.fn.call(item.ctx, ...args));
    }

    clearSystem(ctx) {
        this.systemEvents.forEach(set => {
            set.filter(item => item.ctx !== ctx);
        });
    }

    clear(ctx) {
        this.events.forEach(set => {
            set.filter(item => item.ctx !== ctx);
        });
    }
}

export const eventBus = new EventBus();

