import gsap from "gsap";
import { gameLifecycle } from "../../core/core.d";

export const Coroutine = {
    waitUntil(condition) {
        return new Promise((resolve) => {
            const tick = (delta) => {
                if (condition()) {
                    gameLifecycle.update.removeLateUpdate(tick);
                    resolve();
                }
            };
            gameLifecycle.update.addLateUpdate(tick);
        });
    },

    waitForSeconds(seconds) {
        return new Promise(resolve => {
            gsap.to({}, {
                duration: seconds,
                onComplete: resolve
            });
        });
    },

    waitForAFrame() {
        return new Promise(resolve => {
            requestAnimationFrame(() => resolve());
        });
    }
};

