import { GameObject3D, MonoBehaviour, instantiate } from "engine";
import CONFIG from "scripts/_config/Config";
import { Coroutine } from "scripts/_core/Coroutine";


export function createGameController() {
    return instantiate(GameObject3D, {
        components: [
            new GameController(),
        ]
    })
}

export class GameController extends MonoBehaviour {
    /**
     * @type {GameController}
     */
    static instance;

    awake() {
        GameController.instance = this;
        this.clickCount = 0;
        this.clickLimit = 15;
        this.isEndGame = false;

        this.version = CONFIG.version;


        
        if (this.version.startsWith("01n26_")) {
            const parts = this.version.split("_");
            this.clickLimit = Number(parts[1]) || 15;
        } else {
            this.clickLimit = 15;
        }

    }

    start() {
        CONFIG.onGameReady();

        this.waitForEndGame();
    }

    update(dt) {

    }

    async waitForEndGame() {
        await Coroutine.waitUntil(() => this.clickCount >= this.clickLimit)

        this.isEndGame = true;
        this.openLinkApp();

        window.addEventListener("pointerdown", () => {
            this.openLinkApp();
        });
    }

    openLinkApp() {
        CONFIG.openLinkApp();

        CONFIG.onEndGame();
    }
}