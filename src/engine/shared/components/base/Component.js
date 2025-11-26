import { CoreEventType, eventBus } from "../../../core/core.d";


export class Component {
    constructor() {
        this.gameObject = null;
        this._enabled = true;
    }

    /**
     * goi trong componentManager
     */
    __init() {

    }

    create(gameObject) {
        this.gameObject = gameObject;
        this.__init();
        this.__registerEvents();
    }

    __registerEvents() {
        eventBus.onSystem(CoreEventType.ACTIVE_CHANGE + this.gameObject.ID, (isActive) => {
            if (this.enable && isActive) {
                this._onEnable?.();
            } else {
                this._onDisable?.();
            }
        });

        eventBus.onSystem(CoreEventType.DESTROY + this.gameObject.ID, () => {
            this._destroy();
        });
    }

    _destroy() {
        this.enable = false;
        if (this.gameObject) {
            this.gameObject.removeComponent(this.constructor.name);
        }
        this.gameObject = null;
        this._onDestroy();

    }

    get enable() {
        return this._enabled;
    }

    set enable(value) {
        this._enabled = value;
        if (this._enabled) {
            this._onEnable?.();
        } else {
            this._onDisable?.();
        }
    }

    _onDestroy() {
        Object.values(CoreEventType).forEach(type => {
            eventBus.offSystem(type, this);
        });
    }

    _onEnable() {
    }

    _onDisable() {
    }
}