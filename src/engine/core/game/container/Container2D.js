
import { eventBus } from "../../event/EventBus";
import { CoreEventType } from "../../event/CoreEventType";
import { Container } from "@pixi.alias";
import { appEngine } from "@engine";
import { screen } from "@engine";

import { containerBootstrap } from "./ContainerBootstrap";


class Container2D {
    constructor() {
        console.log(containerBootstrap);

        containerBootstrap.regist(this);

        this.center = new Container();   // center container
        this.center.label = "center";

        this.root = new Container();     // root scene (luôn (0,0))
        this.root.label = "layers";

        this.center.addChild(this.root); // root nằm trong center
        this.containers = new Map();     // key = số layer, value = Container

    }

    async __init() {
        if(!appEngine.pixi) return;
        
        appEngine.pixi.stage.addChild(this.center); // add center vào stage
        this.root.sortableChildren = true;
        this.resize();
        eventBus.onSystem(CoreEventType.ON_RESIZE, this.resize, this);

    }

    resize(width, height) {
        const screenW = screen.width;
        const screenH = screen.height;

        // đặt center vào giữa màn hình
        this.center.position.set(screenW / 2, screenH / 2);
        // scale hiện tại của center (đang zoom)
        const scaleX = this.center.scale.x;
        const scaleY = this.center.scale.y;

        // dịch root ngược lại để (0,0) world map đúng top-left screen
        this.root.position.set(
            -screenW / (2),
            -screenH / (2)
        );
    }

    // nếu layer chưa tồn tại thì tạo mới
    ensureLayer(layerIndex) {
        if (!this.containers.has(layerIndex)) {
            const container = new Container();
            container.label = `layer-${layerIndex}`;
            container.zIndex = layerIndex;
            this.containers.set(layerIndex, container);
            this.root.addChild(container);
        }
        return this.containers.get(layerIndex);
    }

    addChildTo(child, { layer = 1 } = {}) {
        const container = this.ensureLayer(layer);
        container.addChild(child);
    }

    addToScene(child, { layer = 1 } = {}) {
        this.addChildTo(child, { layer });
    }

    clearLayer(layerIndex) {
        const container = this.containers.get(layerIndex);
        if (container) {
            container.removeChildren();
        }
    }

    getLayer(layerIndex) {
        return this.ensureLayer(layerIndex);
    }

    getRootContainer() {
        return this.root;
    }
}

export const container2D = new Container2D();