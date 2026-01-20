import { 
    Block_Color,
    matcap,
    mikado_black_number,
    mikado_black_number_0,
    pixel_block_model, 
    squid_model 
} from "@auto.asset";
import { 
    loadBitmapFont,
    loadModel,
    loadThreeTexture, 
} from "engine";


//==================== USER INTERFACE ====================


export const Asset = {
    MODEL_PIXEL_BLOCK: loadModel(pixel_block_model),
    MODEL_SQUID: loadModel(squid_model),
    FONT_TEST: loadBitmapFont(mikado_black_number, mikado_black_number_0),
    TEXTURE_MATCAP: loadThreeTexture(matcap),
    TEXTURE_PIXEL_BLOCK: loadThreeTexture(Block_Color),
}
//========================================================

export async function loadAssets() {
    for (const key of Object.keys(Asset)) {
        Asset[key] = await Asset[key];
    }
}