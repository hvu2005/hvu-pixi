import { pixel_block_model, squid_model } from "@auto.asset";
import { 
    loadModel, 
    loadThreeTexture 
} from "engine";


//==================== USER INTERFACE ====================


export const Asset = {
    MODEL_PIXEL_BLOCK: loadModel(pixel_block_model),
    MODEL_SQUID: loadModel(squid_model),
}
//========================================================

export async function loadAssets() {
    for (const key of Object.keys(Asset)) {
        Asset[key] = await Asset[key];
    }
}