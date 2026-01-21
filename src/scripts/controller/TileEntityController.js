import { GameObject3D, MonoBehaviour, instantiate } from "engine";
import { TileEntity } from "scripts/model/TileEntity";

export function createTileEntityController() {
    const go = instantiate(GameObject3D, {
        components: [
            new TileEntityController()
        ]
    })

    return go;
}

export class TileEntityController extends MonoBehaviour {
    /**
     * @type {TileEntityController}
     */
    static instance;

    awake() {


    }

    start() {

    }

    moveToConveyor(tileEntity) {
        
    }
}


