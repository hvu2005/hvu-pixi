

class SceneManager {
    constructor() {
        this.scenes = [];
        this.active = null;
    }

    addScene(scene) {
        this.scenes.push(scene);
    }

    async __init() {
        for (const scene of this.scenes) {
            if (!this.active) {
                await this.start(scene);
            }
        }
    }

    async start(scene) {
        this.active = scene;
        await scene.init();
    }

}

export const sceneManager = new SceneManager();