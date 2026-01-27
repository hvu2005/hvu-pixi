import { 
    Block_Color,
    matcap,
    mikado_black_number,
    mikado_black_number_0,
    pixel_block_model, 
    squid_model, 
    rail_model,
    water_texture,
    warning_texture,
    queue,
    bg,
    // sphere_2,
    sphere,
    water,
    rail_shadow,
    start,
    shadow_circle,
    ground_line,
    tut_hand,
    toon_ramp,
    // squid_model1,
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
    MODEL_RAIL: loadModel(rail_model),
    MODEL_PROJECTILE: loadModel(sphere),

    FONT_TEST: loadBitmapFont(mikado_black_number, mikado_black_number_0),

    TEXTURE_MATCAP: loadThreeTexture(matcap),
    TEXTURE_PIXEL_BLOCK: loadThreeTexture(Block_Color),
    TEXTURE_WATER: loadThreeTexture(water_texture),
    TEXTURE_WARNING: loadThreeTexture(warning_texture),
    TEXTURE_TILE_WAIT: loadThreeTexture(queue),
    TEXTURE_BACKGROUND: loadThreeTexture(bg),
    TEXTURE_INK: loadThreeTexture(water),
    TEXTURE_RAIL_SHADOW: loadThreeTexture(rail_shadow),
    TEXTURE_START: loadThreeTexture(start),
    TEXTURE_SQUID_SHADOW: loadThreeTexture(shadow_circle),
    TEXTURE_GROUND_LINE: loadThreeTexture(ground_line),
    TEXTURE_TUT_HAND: loadThreeTexture(tut_hand),
    TEXTURE_TOON_RAMP: loadThreeTexture(toon_ramp),
}
//========================================================

export async function loadAssets() {
    for (const key of Object.keys(Asset)) {
        Asset[key] = await Asset[key];
    }
}