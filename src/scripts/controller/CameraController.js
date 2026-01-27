import { CameraView, GameObject3D, MonoBehaviour, instantiate } from "engine";
import { eventEmitter } from "scripts/_core/EventEmitter";
import { GameEventType } from "scripts/_core/GameEventType";

export function createCameraController() {
    return instantiate(GameObject3D, {
        components: [
            new CameraController(),
        ]
    })
}

export class CameraController extends MonoBehaviour {

    static instance;

    _createCamera() {
        return instantiate(GameObject3D, {
            components: [
                new CameraView({
                    isOrthor: true,
                    fov: 17,
                })
            ],
            rotation: [-Math.PI / 2.5, 0, 0],
            position: [0, 20, 3.5]
        });
    }

    awake() {
        CameraController.instance = this;

        this._lastWidth = 0;
        this._lastHeight = 0;

        this.camera = this._createCamera().getComponent(CameraView);

    }

    start() {

        // init lần đầu
        this._lastWidth = window.innerWidth;
        this._lastHeight = window.innerHeight;
        this.onResize();
    }

    update() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (w !== this._lastWidth || h !== this._lastHeight) {
            this._lastWidth = w;
            this._lastHeight = h;
            this.onResize();
        }
    }

    onResize() {
        const width = this._lastWidth;
        const height = this._lastHeight;

        if(width* 2.2 < height) {
            this.camera.fov = 19;

        }
        else {
            this.camera.fov = 17;
        }
        eventEmitter.emit(GameEventType.RESIZE);
    }
}
