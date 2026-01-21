import { GameObject3D, MonoBehaviour, instantiate, three } from "engine";
import { Raycaster, Vector2 } from "@three.alias";
import { Tag } from "scripts/_config/Tag";
import { TileEntity } from "scripts/model/TileEntity";

export function createTouchController() {
    const go = instantiate(GameObject3D, {
        components: [
            new TouchController()
        ]
    })

    return go;
}

export class TouchController extends MonoBehaviour {
    /**
     * @type {TouchController}
     */
    static instance;

    awake() {
        this.instance = this;
        this.camera = three.camera;
        this.threeRenderer = three.renderer;

        this.raycaster = new Raycaster();
        this.mouse = new Vector2();

    }

    start() {
        this.threeRenderer.domElement.addEventListener('click', (e) => this.handleClick(e));
    }

    normalizeMouse(event) {
        const rect = this.threeRenderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    handleClick(event) {
        this.normalizeMouse(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const result = this.intersect(three.getLayer(0).children);
        
        const hit = result.find(r =>
            r.object?.gameObject?.tag === Tag.TILE_ENTITY
        );
        
        if (hit) {
            const go = hit.object.gameObject;
            const tileEntityComp = go.getComponent(TileEntity);
            tileEntityComp.onSelected();
        }
    }

    intersect(targets) {
        const result = this.raycaster.intersectObjects(targets, true);
        this.result = result;
        return result;
    }
}