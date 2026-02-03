
export class EventBus<TEventMap extends Record<string, (...args: any[]) => void>> {
    private events: Partial<{ [K in keyof TEventMap]: TEventMap[K][] }> = {};

    public on<K extends keyof TEventMap>(event: K, callback: TEventMap[K]): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event]!.push(callback);
    }

    public off<K extends keyof TEventMap>(event: K, callback: TEventMap[K]): void {
        if (!this.events[event]) return;
        this.events[event] = this.events[event]!.filter(cb => cb !== callback);
    }

    protected emit<K extends keyof TEventMap>(event: K, ...args: Parameters<TEventMap[K]>): void {
        if (!this.events[event]) return;
        for (const cb of this.events[event]!) {
            cb(...args);
        }
    }
}
