import { Component } from "engine";
import { AnimationMixer } from "engine/alias/three-alias";

/**
 * @typedef {Object} MeshAnimatorOptions
 * @property {number} [speed]
 * @property {string} [default] 
 */


export class MeshAnimator extends Component {

    /**
     * @param {GLTF} gltf
     * @param {MeshAnimatorOptions} options
     */
    constructor(gltf, options = {}) {
        super();

        this.animations = gltf.animations;

        this.mixer = null;
        this.actions = new Map();
        this.currentAction = null;

        this.speed = options.speed ?? 1;
        this.defaultAnimation = options.default ?? null;
    }

    /**
     * @returns {AnimationMixer}
     */
    getNode() {
        return this.mixer;
    }

    start() {
        const root = this.gameObject.transform.getRenderNode();
        if (!root) {
            throw new Error("MeshAnimator requires a render node");
        }

        if (!this.animations.length) {
            console.warn("MeshAnimator: GLTF has no animations");
            return;
        }

        this.mixer = new AnimationMixer(root);
        this.mixer.addEventListener('finished', this._onActionFinished.bind(this));

        for (const clip of this.animations) {
            this.actions.set(clip.name, this.mixer.clipAction(clip));
        }


        if (this.defaultAnimation) {
            this.play(this.defaultAnimation, { loop: true });
        }
    }

    /**
     * @param {string} name
     * @param {{ loop?: boolean, fade?: number }} options
     */
    play(name, options = {}) {
        if (!this.mixer) return;

        const {
            loop = false,
            fade = 0.2,
        } = options;

        const next = this.actions.get(name);
        if (!next) return;

        // nếu đang chạy rồi → bỏ
        if (this.currentAction === next && next.isRunning()) {
            return;
        }

        next.enabled = true;
        next.reset();

        if (loop) {
            next.setLoop(2201, Infinity); // LoopRepeat
            next.clampWhenFinished = false;
        } else {
            next.setLoop(2200, 1); // LoopOnce
            next.clampWhenFinished = true;
        }

        if (this.currentAction) {
            this.currentAction.crossFadeTo(next, fade, false);
        }

        next.play();
        this.currentAction = next;
    }


    /**
     * Stop current animation
     */
    stop() {
        if (!this.currentAction) return;
        this.currentAction.stop();
        this.currentAction = null;
    }

    /**
     * Set animation speed (timeScale)
     * @param {number} value
     */
    setSpeed(value) {
        this.speed = value;
    }

    update(dt) {
        if (!this.mixer) return;
        this.mixer.update(dt * this.speed);
    }


    /**
     * @private
     * @param {Event} e
     */
    _onActionFinished(e) {
        if (!this.defaultAnimation) return;
    
        const finishedAction = e.action;
    
        // nếu không phải default → quay về default
        if (finishedAction !== this.actions.get(this.defaultAnimation)) {
            this.play(this.defaultAnimation, {
                loop: true,
                fade: 0.2
            });
        }
    }

    _onDestroy() {
        if (this.mixer) {
            this.mixer.stopAllAction();
            this.mixer.uncacheRoot(
                this.gameObject.transform.getRenderNode()
            );
        }

        this.actions.clear();
        this.mixer = null;
        this.currentAction = null;
    }
}
