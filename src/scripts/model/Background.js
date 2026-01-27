import { BoxGeometry, RepeatWrapping } from "@three.alias";
import { GameObject3D, MeshRenderer, MonoBehaviour, instantiate, three } from "engine";
import { eventEmitter } from "scripts/_core/EventEmitter";
import { GameEventType } from "scripts/_core/GameEventType";
import { Material } from "scripts/_load-assets/MaterialFactory";





export function createBackground() {
    const go = instantiate(GameObject3D, {
        components: [
            new MeshRenderer(new BoxGeometry(1.4, 1.3, 0.01), {
                material: Material.BACKGROUND,
            }),
            new BackgroundBehaviour(),
        ],
        rotation: [-Math.PI / 3, 0, Math.PI],
        position: [0, -50, -19.3]
    })
    return go;
}

export class BackgroundBehaviour extends MonoBehaviour {
    awake() {

    }

    start() {
        eventEmitter.on(GameEventType.RESIZE, this.onResize.bind(this));
        this.bgRenderer = this.gameObject.getComponent(MeshRenderer);
        this.mesh = this.bgRenderer?.getNode(); // THREE.Mesh

        this.isTiling = false;
        this.tileWorldSize = 10;
        // this.onResize();
    }

    onResize() {
        const camera = three.camera;
        if (!camera?.isOrthographicCamera || !this.mesh) return;
    
        const viewWidth  = camera.right - camera.left;
        const viewHeight = camera.top - camera.bottom;
    
        this.mesh.scale.set(viewWidth, viewHeight, 1);
    
        if (!this.isTiling) return;
    
        const mat = this.mesh.material;
        const tex = mat?.map;
        if (!tex?.image) return;
    
        tex.wrapS = tex.wrapT = RepeatWrapping;
    
        const img = tex.image;
        const texAspect = img.width / img.height;
    
        const tileW = this.tileWorldSize ?? 20;
        const tileH = tileW / texAspect;
    
        tex.repeat.set(
            viewWidth  / tileW,
            viewHeight / tileH
        );
    
        tex.offset.set(0, 0);
        tex.needsUpdate = true;
    }
}