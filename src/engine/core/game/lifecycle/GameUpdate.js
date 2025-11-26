import { appEngine } from "engine/core/runtime/AppEngine";

export class GameUpdate {
    constructor() {
        this.updates = [];
        this.lateUpdates = [];   // <- thêm danh sách LateUpdate
        this.preSystems = [];
        this.postSystems = [];
        this.isStopUpdate = false;
    }

    run() {
        this._lastTime = 0;
        const loop = (now) => {
            if (this.isStopUpdate) return;

            const delta = (now - this._lastTime) / 100 // ms
            this._lastTime = now;

            // --- PreSystem ---
            this.updatePreSystem(delta);

            // --- Entity Update ---
            this.updateEntity(delta);

            // --- Late Update ---
            this.updateLateEntity(delta);

            // --- Post System ---
            this.updatePostSystem(delta);

            // --- Request next frame ---

            appEngine.render();

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    //#region update
    stopUpdate() {
        this.isStopUpdate = true;
    }

    playUpdate() {
        this.isStopUpdate = false;
    }

    updatePreSystem(delta) {
        if (this.isStopUpdate) return;

        for (const sys of this.preSystems) {
            sys.update?.(delta);
        }
    }

    updateEntity(delta) {
        if (this.isStopUpdate) return;

        for (const obj of this.updates) {
            const ctx = obj.context;

            if (ctx) {
                if (!ctx.gameObject || !ctx.gameObject.activeSelf) continue;
                obj.fn.call(ctx, delta);
            } else {
                obj.fn(delta);
            }
        }
    }

    updateLateEntity(delta) {
        if (this.isStopUpdate) return;

        for (const obj of this.lateUpdates) {
            const ctx = obj.context;

            if (ctx) {
                if (!ctx.gameObject || !ctx.gameObject.activeSelf) continue;
                obj.fn.call(ctx, delta);
            } else {
                obj.fn(delta);
            }
        }
    }

    updatePostSystem(delta) {
        if (this.isStopUpdate) return;

        for (const sys of this.postSystems) {
            sys.update?.(delta);
        }
    }

    // --- quản lý Update ---
    addUpdate(fn, context = null) {
        this.updates.push({ fn, context });
    }

    removeUpdate(fn, context = null) {
        this.updates = this.updates.filter(
            obj => obj.fn !== fn || obj.context !== context
        );
    }

    // --- quản lý LateUpdate ---
    addLateUpdate(fn, context = null) {
        this.lateUpdates.push({ fn, context });
    }

    removeLateUpdate(fn, context = null) {
        this.lateUpdates = this.lateUpdates.filter(
            obj => obj.fn !== fn || obj.context !== context
        );
    }

    // --- quản lý Systems ---
    addPreSystem(sys) {
        this.preSystems.push(sys);
    }

    addPostSystem(sys) {
        this.postSystems.push(sys);
    }
    //#endregion
}