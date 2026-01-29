import { PixiRenderer } from "./pixi-renderer";
import { ThreeRenderer } from "./three-renderer";


type LayerId = number;
type PixiRendererType = PixiRenderer;
type ThreeRendererType = ThreeRenderer;

export interface RenderPipelineOptions {
    pixi?: PixiRendererType;
    three?: ThreeRendererType;
}

export class RenderPipeline {
    public pixi?: PixiRendererType;
    public three?: ThreeRendererType;

    private _layers: LayerId[];               // sorted layer ids
    private _layerSet: Set<LayerId>;

    private _layer2D: Set<LayerId>;      // layer có pixi content
    private _layer3D: Set<LayerId>;      // layer có three content

    constructor(options: RenderPipelineOptions = {}) {
        this.pixi = options.pixi;
        this.three = options.three;

        this._layers = [0];
        this._layerSet = new Set();

        this._layer2D = new Set();
        this._layer3D = new Set();
    }

    async init(): Promise<void> {
        await this.three?.init();
        await this.pixi?.init(this.three?.renderer.getContext() as WebGL2RenderingContext);
        this.pixi?.onResize(981, 1230);
        this.three?.onResize();

        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize(): void {
        this.pixi?.onResize(981, 1230);
        this.three?.onResize();
    }

    setCamera(camera: any, fov: any): void {
        this.three?.setCamera(camera, fov);
    }
    
    resetCamera(): void {
        this.three?.resetCamera();
    }

    addNode2D(node: any, layerId: LayerId): void {
        if(!this.pixi) {
            console.error("[ENGINE ERROR] Pixi Renderer chưa được khởi tạo! Có module cần sử dụng Pixi Renderer!");
            return;
        }
        this.ensureLayer2D(layerId);
        this.pixi.addNode(node, layerId);
    }

    addNode3D(node: any, layerId: LayerId): void {
        if(!this.three) {
            console.error("[ENGINE ERROR] Three Renderer chưa được khởi tạo! Có module cần sử dụng Three Renderer!");
            return;
        }
        this.ensureLayer3D(layerId);
        this.three.addNode(node, layerId);
    }

    removeNode2D(node: any, layerId: LayerId): void {
        this.pixi?.removeNode(node, layerId);
    }

    removeNode3D(node: any, layerId: LayerId): void {
        this.three?.removeNode(node, layerId);
    }

    moveNode2D(node: any, oldLayerId: LayerId, newLayerId: LayerId): void {
        this.removeNode2D(node, oldLayerId);
        this.addNode2D(node, newLayerId);
    }

    moveNode3D(node: any, oldLayerId: LayerId, newLayerId: LayerId): void {
        this.removeNode3D(node, oldLayerId);
        this.addNode3D(node, newLayerId);
    }

    render(): void {
        this._layers.forEach((layerId: LayerId) => {
            this.three?.render(layerId);
            this.pixi?.render(layerId);
        });
    }

    ensureLayer2D(layerId: LayerId): void {
        if (this._layer2D.has(layerId)) return;

        const index = this._findInsertIndex(layerId);
        if (layerId !== this._layers[index]) {
            this._layers.splice(index, 0, layerId);
            this._layerSet.add(layerId);
        }

        this._layer2D.add(layerId);
        this.pixi?.createLayer(layerId);
    }

    ensureLayer3D(layerId: LayerId): void {
        if (this._layer3D.has(layerId)) return;

        const index = this._findInsertIndex(layerId);
        if (layerId !== this._layers[index]) {
            this._layers.splice(index, 0, layerId);
            this._layerSet.add(layerId);
        }

        this._layer3D.add(layerId);
        this.three?.createLayer(layerId);
    }

    createLayer2D(layerId: LayerId): void {
        const index = this._findInsertIndex(layerId);
        this._layers.splice(index, 0, layerId);
        this._layerSet.add(layerId);

        this.pixi?.createLayer(layerId);
    }

    createLayer3D(layerId: LayerId): void {
        const index = this._findInsertIndex(layerId);
        this._layers.splice(index, 0, layerId);
        this._layerSet.add(layerId);

        this.three?.createLayer(layerId);
    }

    /**
     * @private
     */
    private _findInsertIndex(layerId: LayerId): number {
        let low = 0;
        let high = this._layers.length - 1;

        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            if (this._layers[mid] < layerId) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return low;
    }
}
