import { mikado_black, mikado_black_texture, pixel_block_model, squid_model } from "@auto.asset";
import { 
    loadBitmapFont,
    loadModel, 
} from "engine";


//==================== USER INTERFACE ====================


export const Asset = {
    MODEL_PIXEL_BLOCK: loadModel(pixel_block_model),
    MODEL_SQUID: loadModel(squid_model),
    FONT_TEST: loadBitmapFont(mikado_black, mikado_black_texture),
}
//========================================================

export async function loadAssets() {
    for (const key of Object.keys(Asset)) {
        Asset[key] = await Asset[key];
    }
}