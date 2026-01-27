import { GameObject3D, MonoBehaviour, instantiate } from "engine";
import { eventEmitter } from "scripts/_core/EventEmitter";
import { GameEventType } from "scripts/_core/GameEventType";
import { TileEntity } from "scripts/model/TileEntity";
import { LevelGenerator } from "./LevelGenerator";
import gsap from "gsap";
import { MapItem } from "scripts/model/MapItem";
import { PoolController } from "./PoolController";
import { PathController } from "./PathController";
import soundManager from "./SoundManager";
import { GameConfig } from "scripts/_config/GameConfig";

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
    /**
     * @type {GameFlowController}
     */
    static instance;

    awake() {
        GameFlowController.instance = this;
    }

    start() {
        eventEmitter.on(GameEventType.PATH_COMPLETED, this.onPathCompleted.bind(this));
        eventEmitter.on(GameEventType.TILE_ENTITY_MOVED_TO_CONVEYOR, this.onTileEntitySelected.bind(this));

        this.gameCache = LevelGenerator.instance.cache;
        this.waitTileFlags = new Array(this.gameCache.waitTileMapData.length).fill(false);
        this.tileMapData = this.gameCache.tileMapData;
        this.mapItemMapData = this.gameCache.mapItemMapData;
        this.width = this.gameCache.width;
        this.height = this.gameCache.height;

        this.instancedItemMap = this.gameCache.instancedItemMap;
        // Optional map for go <-> slot assignment
        this.waitTileAssignments = {};
    }

    /**
     * Khi tileEntity được select, tìm trong từng mảng con của tileMapData,
     * chỉ khi phần tử đầu tiên của mảng đó đúng tileEntity thì mới xoá.
     * Chỉ dịch các phần tử trong mảng đó lên trên (không dịch các phần tử đầu của các mảng khác).
     * Sau khi tất cả delay (animation) xong hết rồi mới arr.shift.
     * Sau khi shift, nếu có phần tử đầu tiên mới thì setTextOpacity(1)
     *
     * Nếu tileEntity nằm tại waitTile, khi click lại thì index tại waitTile đó = false
     */
    onTileEntitySelected(tileEntity) {
        // Check if this tileEntity is on any waitTile slot, and if so, free the slot
        let foundOnWaitTile = false;
        for (let i = 0; i < this.waitTileFlags.length; i++) {
            if (this.waitTileFlags[i] && this.waitTileAssignments[i] === tileEntity) {
                // Un-assign this slot
                this.waitTileFlags[i] = false;
                this.waitTileAssignments[i] = null;
                foundOnWaitTile = true;
                break;
            }
        }

        // tileEntity là GameObject3D, so sánh bằng ===
        for (let i = 0; i < this.tileMapData.length; i++) {
            const arr = this.tileMapData[i];
            if (arr && arr.length > 0 && arr[0] && arr[0].gameObject === tileEntity) {
                // Trước khi tween, nếu có con thứ 5 thì setActive(true)
                if (arr.length > GameConfig.MAX_SQUID_SHOW_PER_COL && arr[GameConfig.MAX_SQUID_SHOW_PER_COL] && typeof arr[GameConfig.MAX_SQUID_SHOW_PER_COL].gameObject?.setActive === "function") {
                    arr[GameConfig.MAX_SQUID_SHOW_PER_COL].gameObject.setActive(true);
                }

                // Chạy animation dịch các tile bên dưới trước
                for (let j = this.tileMapData[i].length - 1; j >= 1; j--) {
                    const tile = this.tileMapData[i][j];
                    const delay = 0.1 + j * 0.05;
                    gsap.to(tile.gameObject.transform.position, {
                        z: GameConfig.TILE_FIRST.z + GameConfig.TILE_OFFSET.z  * (j - 1),
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
                        arr[0].setFirst();
                    }
                }, 0.1 * 1000); // 150ms bị lược bỏ, chỉ dùng maxDelay*1000
                break;
            }
        }

        gsap.delayedCall(0.25, () => {
            this.checkMatch(tileEntity);
        });
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
        if (!tileEntityComp || tileEntityComp.count <= 0) return;

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

    /**
     * 
     * @param {GameObject3D} tileEntity 
     */
    async checkMatch(tileEntity) {
        const comp = tileEntity.getComponent(TileEntity);
        const tileData = comp.data;
        const itemColorType = tileData.itemColorType;

        // Bottom 
        const botResultIndexes = [];
        for (let i = 0; i < this.width; i++) {
            let top = this.height - 1;
            while (top > 0 && this.mapItemMapData[top][i] === -1) {
                top--;
            }

            if (itemColorType === this.mapItemMapData[top][i]) {
                if (tileData.countColorFill <= 0) break;
                this.mapItemMapData[top][i] = -1;
                botResultIndexes.push(top * this.width + i);
                tileData.countColorFill--;

            }
        }

        // Right
        const rightResultIndexes = [];
        for (let i = this.height - 1; i >= 0; i--) {

            let left = this.width - 1;
            while (left > 0 && this.mapItemMapData[i][left] === -1) {
                left--;
            }

            if (itemColorType === this.mapItemMapData[i][left]) {
                if (tileData.countColorFill <= 0) break;
                this.mapItemMapData[i][left] = -1;
                rightResultIndexes.push(i * this.width + left);
                tileData.countColorFill--;

            }


        }

        // Top
        const topResultIndexes = [];
        for (let i = this.width - 1; i >= 0; i--) {
            let bottom = 0;
            while (bottom < this.height - 1 && this.mapItemMapData[bottom][i] === -1) {
                bottom++;
            }

            if (itemColorType === this.mapItemMapData[bottom][i]) {
                if (tileData.countColorFill <= 0) break;
                this.mapItemMapData[bottom][i] = -1;
                topResultIndexes.push(bottom * this.width + i);
                tileData.countColorFill--;

            }
        }

        // Left
        const leftResultIndexes = [];
        for (let i = 0; i < this.height; i++) {
            let right = 0;
            while (right < this.width - 1 && this.mapItemMapData[i][right] === -1) {
                right++;
            }

            if (itemColorType === this.mapItemMapData[i][right]) {
                if (tileData.countColorFill <= 0) break;
                this.mapItemMapData[i][right] = -1;
                leftResultIndexes.push(i * this.width + right);
                tileData.countColorFill--;
            }
        }

        //move results to holder
        for (let i = 0; i < botResultIndexes.length; i++) {
            const index = botResultIndexes[i];
            const itemMapTransform = this.instancedItemMap.getTransformAt(index);
            await this.matchMapItem(
                index,
                comp,
                itemMapTransform.position,
                () => tileEntity.transform.position.x > (itemMapTransform.position.x - 2)
            );
        }
        for (let i = 0; i < rightResultIndexes.length; i++) {
            const index = rightResultIndexes[i];
            const itemMapTransform = this.instancedItemMap.getTransformAt(index);
            await this.matchMapItem(
                index,
                comp,
                itemMapTransform.position,
                () => tileEntity.transform.position.z < (itemMapTransform.position.z + 2)
            );
        }
        for (let i = 0; i < topResultIndexes.length; i++) {
            const index = topResultIndexes[i];
            const itemMapTransform = this.instancedItemMap.getTransformAt(index);
            await this.matchMapItem(
                index,
                comp,
                itemMapTransform.position,
                () => tileEntity.transform.position.x < (itemMapTransform.position.x + 2) && tileEntity.__pathState >= 3
            );

        }
        for (let i = 0; i < leftResultIndexes.length; i++) {
            const index = leftResultIndexes[i];
            const itemMapTransform = this.instancedItemMap.getTransformAt(index);
            await this.matchMapItem(
                index,
                comp,
                itemMapTransform.position,
                () => tileEntity.transform.position.z > (itemMapTransform.position.z - 2) && tileEntity.__pathState >= 5
            );
        }
    }

    /**
     * 
     * @param {number} mapItemIndex 
     * @param {TileEntity} tileEntityComp 
     * @param {*} predicate 
     */
    async matchMapItem(mapItemIndex, tileEntityComp, mapItemPosition, predicate) {

        // 1. Đợi điều kiện match
        await new Promise(resolve => {
            const check = async () => {
                if (await predicate()) resolve();
                else setTimeout(check, 33);
            };
            check();
        });

        // 2. Spawn projectile
        const projectile = PoolController.instance
            .getPool("projectile")
            .get();

        // 3. Lấy vị trí start (TileEntity)
        const startPos = tileEntityComp.getMouthPosition();

        projectile.transform.position.set(
            startPos.x,
            startPos.y,
            startPos.z
        );

        // 4. Tính duration theo SPEED
        const dx = mapItemPosition.x - startPos.x;
        const dy = mapItemPosition.y - startPos.y;
        const dz = mapItemPosition.z - startPos.z;

        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const speed = 20; // units / second (tuỳ game)
        const duration = distance / speed;

        // 5. Tween projectile
        gsap.to(
            projectile.transform.position,
            {
                x: mapItemPosition.x,
                y: mapItemPosition.y,
                z: mapItemPosition.z,
                duration: duration,
                ease: "linear",
                onComplete: () => {
                    // 1. trả projectile về pool
                    PoolController.instance.getPool("projectile").release(projectile);
                    soundManager.playMoveTile();

                    // 2. pop + shrink itemMap
                    const scaleObj = { s: 0 };

                    tileEntityComp.setText(--tileEntityComp.count + "");

                    if (tileEntityComp.count <= 0) {
                        gsap.timeline()
                            .to(tileEntityComp.gameObject.transform.scale, {
                                x: 1.3,
                                y: 1.3,
                                z: 1.3,
                                duration: 0.1,
                                ease: "back.out(1.7)"
                            })
                            .to(tileEntityComp.gameObject.transform.scale, {
                                x: 0,
                                y: 0,
                                z: 0,
                                duration: 0.1,
                                ease: "power2.in"
                            });

                        PathController.instance.stopPath(tileEntityComp.gameObject);
                        soundManager.playMatch();
                    }

                    // Hiệu ứng nổ, đồng thời lấy ink từ pool, scale 0 - 1 - 0 rồi release

                    // Tạo hiệu ứng cho tile (cũ)
                    gsap.timeline()
                        .to(scaleObj, {
                            s: 1.5,
                            duration: 0.05,
                            ease: "back.out(2)",
                            onUpdate: () => {
                                this.instancedItemMap.setInstanceScale(
                                    mapItemIndex,
                                    1,
                                    scaleObj.s + 1,
                                    1
                                );
                            }
                        })
                        .to(scaleObj, {
                            s: 0,
                            duration: 0.1,
                            ease: "power2.in",
                            onUpdate: () => {
                                this.instancedItemMap.setInstanceScale(
                                    mapItemIndex,
                                    scaleObj.s,
                                    scaleObj.s,
                                    scaleObj.s
                                );
                            }
                        });

                    // // Song song: hiệu ứng ink nổ
                    // const ink = PoolController.instance.getPool("ink").get();
                    // // Đặt vị trí ink ở vị trí mapItem
                    // ink.transform.position.set(
                    //     mapItemPosition.x,
                    //     mapItemPosition.y , // hơi nổi lên 1 chút
                    //     mapItemPosition.z ,
                    // );
                    // ink.transform.scale.set(0, 0, 0);
                    
                    // gsap.timeline()
                    //     .to(ink.transform.scale, {
                    //         x: 1,
                    //         y: 1,
                    //         z: 1,
                    //         duration: 0.15,
                    //         ease: "back.out(2)"
                    //     })
                    //     .to(ink.transform.scale, {
                    //         x: 0,
                    //         y: 0,
                    //         z: 0,
                    //         duration: 0.19,
                    //         ease: "power2.in",
                    //         onComplete: () => {
                    //             PoolController.instance.getPool("ink").release(ink);
                    //         }
                    //     });

                }
            }
        );

        // 6. Xử lý tile
        tileEntityComp.playAttackAnimation();
    }


}