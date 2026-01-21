import { GameObject3D, MonoBehaviour, instantiate } from "engine";
import { eventEmitter } from "scripts/_core/EventEmitter";
import { GameEventType } from "scripts/_core/GameEventType";
import { TileEntity } from "scripts/model/TileEntity";
import { LevelGenerator } from "./LevelGenerator";
import gsap from "gsap";

export function createGameFlowController() {
    const go = instantiate(GameObject3D, {
        tag: "GameFlowController",
        components: [
            new GameFlowController()
        ]
    });
    return go;
}

export class GameFlowController extends MonoBehaviour {
    static instance;

    awake() {
        GameFlowController.instance = this;
    }

    start() {
        eventEmitter.on(GameEventType.PATH_COMPLETED, this.onPathCompleted.bind(this));
        eventEmitter.on(GameEventType.TILE_ENTITY_SELECTED, this.onTileEntitySelected.bind(this));

        this.gameCache = LevelGenerator.instance.cache;
        this.waitTileFlags = new Array(this.gameCache.waitTileMapData.length).fill(false);
        this.tileMapData = this.gameCache.tileMapData;
        // Optional map for go <-> slot assignment
        this.waitTileAssignments = {};
    }

    /**
     * Khi tileEntity được select, tìm trong từng mảng con của tileMapData,
     * chỉ khi phần tử đầu tiên của mảng đó đúng tileEntity thì mới xoá.
     * Chỉ dịch các phần tử trong mảng đó lên trên (không dịch các phần tử đầu của các mảng khác).
     * Sau khi tất cả delay (animation) xong hết rồi mới arr.shift.
     * Sau khi shift, nếu có phần tử đầu tiên mới thì setTextOpacity(1)
     */
    onTileEntitySelected(tileEntity) {
        // tileEntity là GameObject3D, so sánh bằng ===
        for (let i = 0; i < this.tileMapData.length; i++) {
            const arr = this.tileMapData[i];
            if (arr && arr.length > 0 && arr[0] && arr[0].gameObject === tileEntity) {
                // Chạy animation dịch các tile bên dưới trước
                for (let j = this.tileMapData[i].length - 1; j >= 1; j--) {
                    const nextTile = this.tileMapData[i][j - 1];
                    const tile = this.tileMapData[i][j];
                    const delay = j * 0.05;
                    gsap.to(tile.gameObject.transform.position, {
                        z: nextTile.gameObject.transform.position.z,
                        duration: 0.15,
                        ease: "power2.out",
                        delay: delay,
                    });
                }

                // Đợi toàn bộ delays xong hết rồi mới shift (tức là sau maxDelay)
                setTimeout(() => {
                    arr.shift();
                    // Sau khi shift, nếu có phần tử đầu mới thì setTextOpacity(1)
                    if (arr.length > 0 && arr[0] && typeof arr[0].setTextOpacity === "function") {
                        arr[0].setTextOpacity(1);
                    }
                }, 0.05 * 1000); // 150ms bị lược bỏ, chỉ dùng maxDelay*1000
                break;
            }
        }
    }

    /**
     * Tìm index slot wait tile trống đầu tiên
     */
    findFirstUnusedWaitTile() {
        for (let i = 0; i < this.waitTileFlags.length; i++) {
            if (!this.waitTileFlags[i]) return i;
        }
        return -1;
    }

    /**
     * 
     * @param {GameObject3D} go 
     * @returns 
     */
    onPathCompleted(go) {
        const tileEntityComp = go.getComponent(TileEntity);
        if (!tileEntityComp) return;

        tileEntityComp.playLandingAnimation();

        // Find empty wait tile slot
        const emptyIdx = this.findFirstUnusedWaitTile();
        if (emptyIdx === -1) {
            // No empty slot
            return;
        }
        this.waitTileFlags[emptyIdx] = true;

        const waitTile = this.gameCache.waitTileMapData[emptyIdx];
        if (!waitTile) return;

        // Animate go to the position of the empty wait tile
        const targetPos = waitTile.transform.position;
        const objPos = go.transform.position;
        gsap.to(objPos, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                // Optional: additional logic on arrival
            }
        });

        gsap.to(go.transform.rotation, {
            y: Math.PI,
            duration: 0.5,
            ease: "power2.inOut",
        });

        this.waitTileAssignments[emptyIdx] = go;
    }

}