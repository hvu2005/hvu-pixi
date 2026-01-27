import gsap from "gsap";

export const Coroutine = {
    waitUntil(condition) {
        return new Promise((resolve) => {
            const check = () => {
                if (condition()) {
                    resolve();
                } else {
                    setTimeout(check, 33); // ~60fps
                }
            };
            check();
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

