import { Howl } from "howler";
import CONFIG from "scripts/_config/Config";


// Import các file âm thanh từ @src/sounds
import bgm from "sounds/gameplay_songMain.mp3";
import sfx_click from "sounds/bobbin_Full.mp3";
import sfx_match from "sounds/Win_Level.mp3";
import sfx_move_tile from "sounds/btn_sound.mp3";

class SoundManager {
    constructor() {
        this.sounds = {};
        window.audioThepn = this;

        this.add("bgm", bgm);
        this.add("click", sfx_click);
        this.add("match", sfx_match);
        this.add("moveTile", sfx_move_tile);

        window.addEventListener(
            "pointerup",
            () => {
                this.isFirstClick = true;
                this.playBgm();
            },
            { once: true }
        );

        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                this.playBgm();
            } else {
                this.stopAll();
            }
        });
    }

    add(key, url, options = {}) {
        this.sounds[key] = new Howl({
            src: [url],
            preload: true,
            ...options,
        });
    }

    play(key, { loop = false, volume = 1.0 } = {}) {
        if (!this.isFirstClick) return;
        const sound = this.sounds[key];
        if (!sound) return;
        sound.volume(volume);
        sound.loop(loop);
        sound.play();
    }

    stop(key) {
        const sound = this.sounds[key];
        if (sound) sound.stop();
    }

    stopAll() {
        for (const key in this.sounds) {
            this.sounds[key].stop();
        }
    }

    unlockAll() {
        for (const key in this.sounds) {
            const sound = this.sounds[key];
            sound.mute(true);
            const id = sound.play();
            sound.once("play", () => {
                sound.stop(id);
                sound.mute(false);
            });
        }
    }

    playBgm() {
        if (CONFIG.isPlaySound) {
            this.play("bgm", { loop: true, volume: 1 });
        }
    }

    playClick() {
        if (CONFIG.isPlaySound) {
            this.play("click", { volume: 1 });
        }
    }

    playMatch() {
        if (CONFIG.isPlaySound) {
            this.play("match", { volume: 1 });
        }
    }

    playMoveTile() {
        if (CONFIG.isPlaySound) {
            this.play("moveTile", { volume: 1 });
        }
    }

    playSfx(name) {
        if (CONFIG.isPlaySound) {
            this.play(name, { volume: 1 });
        }
    }
}

const soundManager = new SoundManager();

export default soundManager;

