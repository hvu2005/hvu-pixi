
import { appEngine } from "engine/core/runtime/AppEngine";
import { Group } from '@three.alias';
import { containerBootstrap } from "engine/core/game/container/ContainerBootstrap";


class Container3D {
    constructor() {
        containerBootstrap.regist(this);

        this.root = new Group();
    }

    async __init() {
        if(!appEngine.three) return;

        appEngine.three.scene.add(this.root);
    }

    resize(width, height) {

    }

    // nếu layer chưa tồn tại thì tạo mới
    ensureLayer(layerIndex) {

    }

    addChildTo(child, { layer = 1 } = {}) {

    }

    addToScene(child) {
        this.root.add(child);
    }

    clearLayer(layerIndex) {

    }

    getLayer(layerIndex) {

    }

    getRootContainer() {

    }
}

export const container3D = new Container3D();