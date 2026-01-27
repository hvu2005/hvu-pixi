import { DynamicText3D, GameObject3D, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { eventEmitter } from "scripts/_core/EventEmitter";
import { GameEventType } from "scripts/_core/GameEventType";
import { TileEntity } from "scripts/model/TileEntity";
import { PathController } from "./PathController";
import { GameConfig } from "scripts/_config/GameConfig";
import gsap from "gsap";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { GameController } from "./GameController";
import soundManager from "./SoundManager";

export function createTileEntityController() {
    const go = instantiate(GameObject3D, {
        components: [
            new TileEntityController(),
            new DynamicText3D(Asset.FONT_TEST.texture, Asset.FONT_TEST.font, {
                scale: [0.015, 0.015, 0.015],
                rotation: [-Math.PI / 2.5, 0, 0],
                position: [-5.5, 5, 1.3],
                align: "center",
                opacity: 1,
                text: "0/5"
            })
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
        TileEntityController.instance = this;
        this.selectedCount = 0;
        this.maxCount = 5;

        this.text = this.getComponent(DynamicText3D);
    }

    start() {
        eventEmitter.on(GameEventType.TILE_ENTITY_SELECTED, this.onTileEntitySelected.bind(this));
        eventEmitter.on(GameEventType.PATH_COMPLETED, this.onPathCompleted.bind(this));
    }

    /**
     * Gọi khi một tileEntity được chọn bởi người chơi (click vào tileEntity)
     * @param {GameObject3D} tileEntity 
     * @returns 
     */
    async onTileEntitySelected(tileEntity) {
        if(GameController.instance.isEndGame) return;

        if (this.selectedCount >= this.maxCount) {
            // Optionally show some feedback: đã đủ số lượng con, không thể chọn nữa
            const tileEntityComp = tileEntity.getComponent(TileEntity);
            tileEntityComp.playInvalidClickAnimation?.();
            return;
        }

        const tileEntityComp = tileEntity.getComponent(TileEntity);
        if (!tileEntityComp.isSelectable) {
            tileEntityComp.playInvalidClickAnimation?.();
            return;
        }

        tileEntityComp.playLandingAnimation?.();
        PathController.instance.moveToConveyor(tileEntity, { speed: GameConfig.MOVE_SPEED });

        eventEmitter.emit(GameEventType.TILE_ENTITY_MOVED_TO_CONVEYOR, tileEntity);
        tileEntityComp.hideShadow();
        this.selectedCount += 1;
        this.text.setText(this.selectedCount + "/" + this.maxCount);
        GameController.instance.clickCount += 1;
        soundManager.playClick();
    }

    /**
     * Khi path complete (ví dụ 1 tileEntity hoàn thành di chuyển tới conveyor), giảm selectedCount đi 1.
     */
    onPathCompleted() {
        if (this.selectedCount > 0) {
            this.selectedCount -= 1;
        }
        this.text.setText(this.selectedCount + "/" + this.maxCount);

    }
}

