
export interface GameObject {
    layer: number | string;
    [key: string]: any;
}

export class RenderService {
    constructor() {}

    public async init(): Promise<void> {}

    public createLayer(layerId: number | string): void {}

    public getLayer(layerId: number | string): any {}

    public changeLayer(node: GameObject, layerId: number | string): void {
        const oldLayer = node.layer;
        this.removeNode(node, oldLayer);
        this.addNode(node, layerId);
    }

    public render(layerId: number | string): void {}

    public onResize(width: number, height: number): void {}

    public addNode(node: GameObject, layerId: number | string): void {}

    public removeNode(node: GameObject, layerId: number | string): void {}
}
