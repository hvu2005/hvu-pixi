
import { PostSystem } from "../base/PostSystem";

class Input extends PostSystem {
    constructor() {
        super();
    }

    init() {

        this.keysDown = new Set();
        this.keysPressed = new Set();
        this.keysReleased = new Set();

        this.mouseDown = new Set();      // Button codes: 0 = left, 1 = middle, 2 = right
        this.mousePressed = new Set();
        this.mouseReleased = new Set();

        this.mousePosition = { x: 0, y: 0 };

        this.keyMap = {}; // alias → key list

        this._setupListeners();
    }

    _setupListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (!this.keysDown.has(e.key)) {
                this.keysPressed.add(e.key);
            }
            this.keysDown.add(e.key);
        });

        window.addEventListener('keyup', (e) => {
            this.keysDown.delete(e.key);
            this.keysReleased.add(e.key);
        });

        // Mouse buttons
        window.addEventListener('pointerdown', (e) => {
            if (!this.mouseDown.has(e.button)) {
                this.mousePressed.add(e.button);
            }
            this.mouseDown.add(e.button);
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });

        window.addEventListener('pointerup', (e) => {
            this.mouseDown.delete(e.button);
            this.mouseReleased.add(e.button);
        });

        // Mouse position
        window.addEventListener('pointermove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
    }

    update(delta) {
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mousePressed.clear();
        this.mouseReleased.clear();
    }

    //#region Keyboard APIs
    bind(action, keys) {
        this.keyMap[action] = keys;
    }

    isDown(keyOrAction) {
        const keys = this._resolveKeys(keyOrAction);
        return keys.some(k => this.keysDown.has(k));
    }

    isPressed(keyOrAction) {
        const keys = this._resolveKeys(keyOrAction);
        return keys.some(k => this.keysPressed.has(k));
    }

    isReleased(keyOrAction) {
        const keys = this._resolveKeys(keyOrAction);
        return keys.some(k => this.keysReleased.has(k));
    }

    _resolveKeys(keyOrAction) {
        return this.keyMap[keyOrAction] || [keyOrAction];
    }
    //#endregion
    //#region Mouse APIs
    isMouseDown(button = 0) {
        return this.mouseDown.has(button);
    }

    isMousePressed(button = 0) {
        return this.mousePressed.has(button);
    }

    isMouseReleased(button = 0) {
        return this.mouseReleased.has(button);
    }

    getMousePosition() {
        return { ...this.mousePosition };
    }
    //#endregion
}

export const input = new Input();