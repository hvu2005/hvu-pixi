
export class EventEmitter {
    constructor() {
        this._events = {};
    }

    /**
     * Đăng ký lắng nghe sự kiện
     * @param {string} event 
     * @param {Function} listener 
     */
    on(event, listener) {
        if (!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(listener);
        return this; // for chaining
    }

    /**
     * Hủy lắng nghe sự kiện
     * @param {string} event 
     * @param {Function} listener 
     */
    off(event, listener) {
        if (!this._events[event]) return this;
        if (!listener) {
            // Nếu không truyền listener, xóa hết
            this._events[event] = [];
        } else {
            this._events[event] = this._events[event].filter(l => l !== listener);
        }
        return this;
    }

    /**
     * Gửi sự kiện
     * @param {string} event 
     * @param  {...any} args 
     */
    emit(event, ...args) {
        if (!this._events[event]) return false;
        this._events[event].forEach(listener => {
            try {
                listener(...args);
            } catch (e) {
                // Đảm bảo event bus không vỡ luồng khi listener lỗi
                console.error(`Error in listener for event "${event}":`, e);
            }
        });
        return true;
    }
}
export const eventEmitter = new EventEmitter();