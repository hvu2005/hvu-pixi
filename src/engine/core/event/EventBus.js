
import { CoreEventType } from "./CoreEventType";


class EventBus {
    constructor() {
        this.listeners = {};        // user listeners
        this.systemListeners = {};  // system listeners (never clear)

        this.boundOnResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.boundOnResize);
    }

    onWindowResize(event) {
        this.emit(CoreEventType.WINDOW_RESIZE);
    }

    // listener hệ thống (không clear đc)
    onSystem(event, callback, context = null) {
        if (!this.systemListeners[event]) this.systemListeners[event] = [];
        this.systemListeners[event].push({ callback, context });
    }

    offSystem(event, context = null) {
        if (!this.systemListeners[event]) return;
        if (context === null) {
            delete this.systemListeners[event];
        } else {
            this.systemListeners[event] = this.systemListeners[event].filter(
                listener => listener.context !== context
            );
            if (this.systemListeners[event].length === 0) {
                delete this.systemListeners[event];
            }
        }
    }

    // listener bình thường
    on(event, callback, context = null) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push({ callback, context });
    }

    off(event, context = null) {
        if (!this.listeners[event]) return;
        if (context === null) {
            delete this.listeners[event];
        } else {
            this.listeners[event] = this.listeners[event].filter(
                listener => listener.context !== context
            );
            if (this.listeners[event].length === 0) {
                delete this.listeners[event];
            }
        }
    }

    emit(event, ...data) {
        const callAll = (arr) => {
            if (!arr) return;
            for (const { callback, context } of arr) {
                try {
                    callback.call(context, ...data);
                } catch (err) {
                    console.warn(`EventBus error in ${event} callback`, err);
                }
            }
        };

        // gọi system trước, user sau
        callAll(this.systemListeners[event]);
        callAll(this.listeners[event]);
    }

    // clear toàn bộ user listener
    clear() {
        this.listeners = {};
    }

    dispose() {
        window.removeEventListener('resize', this.boundOnResize);
        this.listeners = {};
        this.systemListeners = {}; // cẩn thận, clear hết luôn kể cả system
    }
}

export const eventBus = new EventBus();

