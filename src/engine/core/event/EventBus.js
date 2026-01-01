

export class EventBus {
    constructor() {
        /**
         * @type {Map<string, Set<Function>>}
         * @private
         */
        this._listeners = new Map();
        
        /**
         * @type {Map<string, Set<Function>>}
         * @private
         */
        this._onceListeners = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }

        this._listeners.get(event).add(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event once (auto-unsubscribe after first call)
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    once(event, callback) {
        if (!this._onceListeners.has(event)) {
            this._onceListeners.set(event, new Set());
        }

        this._onceListeners.get(event).add(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        if (this._listeners.has(event)) {
            this._listeners.get(event).delete(callback);
            if (this._listeners.get(event).size === 0) {
                this._listeners.delete(event);
            }
        }

        if (this._onceListeners.has(event)) {
            this._onceListeners.get(event).delete(callback);
            if (this._onceListeners.get(event).size === 0) {
                this._onceListeners.delete(event);
            }
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Data to pass to listeners
     */
    emit(event, ...data) {
        // Call regular listeners
        if (this._listeners.has(event)) {
            const listeners = Array.from(this._listeners.get(event));
            for (const listener of listeners) {
                try {
                    listener(...data, event);
                } catch (error) {
                    console.error(`Error in event listener for "${event}":`, error);
                }
            }
        }

        // Call once listeners and remove them
        if (this._onceListeners.has(event)) {
            const onceListeners = Array.from(this._onceListeners.get(event));
            this._onceListeners.delete(event);
            
            for (const listener of onceListeners) {
                try {
                    listener(...data, event);
                } catch (error) {
                    console.error(`Error in once event listener for "${event}":`, error);
                }
            }
        }
    }

    /**
     * Remove all listeners for a specific event
     * @param {string} event - Event name (optional, if not provided clears all)
     */
    clear(event = null) {
        if (event) {
            this._listeners.delete(event);
            this._onceListeners.delete(event);
        } else {
            this._listeners.clear();
            this._onceListeners.clear();
        }
    }

    /**
     * Get the number of listeners for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    listenerCount(event) {
        let count = 0;
        if (this._listeners.has(event)) {
            count += this._listeners.get(event).size;
        }
        if (this._onceListeners.has(event)) {
            count += this._onceListeners.get(event).size;
        }
        return count;
    }

    /**
     * Check if an event has any listeners
     * @param {string} event - Event name
     * @returns {boolean}
     */
    hasListeners(event) {
        return this.listenerCount(event) > 0;
    }
}
