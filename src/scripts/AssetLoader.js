import { loadModel, loadPixiTexture, loadThreeTexture } from "engine";

import item from "assets/AS_1.png";
import duck_model from "assets/duck_model.glb";
import train_model from "assets/train.glb";
import new_train from "assets/new train.png";

export const Asset = {
    ITEM: loadPixiTexture(item),
    MODEL_DUCK: loadModel(duck_model),
    MODEL_TRAIN: loadModel(train_model),
    TEXTURE_TRAIN: loadThreeTexture(new_train),
}

export async function loadAssets() {
    for (const key of Object.keys(Asset)) {
        Asset[key] = await Asset[key];
    }
}