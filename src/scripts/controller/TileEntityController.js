import { GameObject3D, MonoBehaviour, instantiate } from "engine";
import { eventEmitter } from "scripts/_core/EventEmitter";
import { GameEventType } from "scripts/_core/GameEventType";
import { TileEntity } from "scripts/model/TileEntity";
import { PathController } from "./PathController";

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
        eventEmitter.on(GameEventType.TILE_ENTITY_SELECTED, this.onTileEntitySelected.bind(this));

    }

    onTileEntitySelected(tileEntity) {
        const tileEntityComp = tileEntity.getComponent(TileEntity);
        // if (!tileEntityComp.isSelectable) return;

        tileEntityComp.playLandingAnimation();
        PathController.instance.moveToConveyor(tileEntity, { speed: 10 });
    }
}


