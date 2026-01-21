import { GameObject3D, MonoBehaviour, instantiate } from "engine";
import { GameConfig } from "scripts/_config/GameConfig";
import { ItemColorType } from "scripts/_config/ItemColorType";
import { LEVEL_DATA } from "scripts/model/LevelData";
import { createMapItem, MapItem } from "scripts/model/MapItem";
import { TileEntity, createTileEntity } from "scripts/model/TileEntity";
import { createTileWait } from "scripts/model/TileWait";

export function createLevelGenerator() {
    const go = instantiate(GameObject3D, {
        tag: "LevelGenerator",
        components: [
            new LevelGenerator()
        ]
    });

    return go;
}

export class LevelGenerator extends MonoBehaviour {

    /**
     * @type {LevelGenerator}
     */
    static instance;

    awake() {
        LevelGenerator.instance = this;
        this.colorTypes = Object.keys(ItemColorType);

        this.cache = {
            mapItemMapData: [],
            tileMapData: [],
            waitTileMapData: [],
        };

        /**
         * @type {LevelObject}
         */
        this.levelObject;
        this.readLevel(LEVEL_DATA);

        this.generateMap();
        this.generateTiles();
        this.generateWaitTiles();
    }

    start() {

    }

    readLevel(lvlData) {
        const w = Math.max(...lvlData.mapItems.map(itemList => itemList.length));
        const h = lvlData.mapItems.length;

        this.levelObject = {
            width: w,
            height: h,
            mapItems: lvlData.mapItems,
            tileWaits: lvlData.tileWaits ? lvlData.tileWaits.length : 0,
            tiles: lvlData.tiles,
        }
    }

    generateMap() {
        const mapItems = this.levelObject.mapItems;
        const designW = GameConfig.DESIGN_GRID.x;
        const designH = GameConfig.DESIGN_GRID.y;
        const w = this.levelObject.width;
        const h = this.levelObject.height;

        const scale = Math.min(designH / h, designW / w);

        this.mapContainer = instantiate(GameObject3D);
        this.mapContainer.transform.scale.set(scale, scale, scale);
        this.mapContainer.transform.position.set(0, 0, -10.5);

        const offsetX = -(w - 1) / 2;
        const offsetZ = -(h - 1) / 2;

        for (let i = 0; i < mapItems.length; i++) {
            for (let j = 0; j < mapItems[i].length; j++) {
                if (!mapItems[i][j].itemColorType) continue;

                const mapItem = createMapItem();

                mapItem.transform.position.set(
                    offsetX + j,
                    0,
                    offsetZ + i
                );

                const colorTypeKey = this.colorTypes[mapItems[i][j].itemColorType];
                const colorTypeValue = ItemColorType[colorTypeKey];

                const mapItemComp = mapItem.getComponent(MapItem);
                mapItemComp.setColor(colorTypeValue);

                this.mapContainer.transform.addChild(mapItem.transform);

                !this.cache.mapItemMapData[i] && (this.cache.mapItemMapData[i] = []);
                this.cache.mapItemMapData[i][j] = mapItemComp;
            }
        }
    }


    generateTiles() {
        const tiles = this.levelObject.tiles;

        const firstPosX = (tiles.length - 1) * -1.25;

        for (let i = 0; i < tiles.length; i++) {
            let isTop = true;

            for (let j = 0; j < tiles[i].length; j++) {
                const tile = createTileEntity();
                tile.transform.position.set(firstPosX + i * 2.5, 0, 7 + j * 2.8);

                const colorTypeKey = this.colorTypes[tiles[i][j].itemColorType];
                const colorTypeValue = ItemColorType[colorTypeKey];

                const tileComp = tile.getComponent(TileEntity)
                tileComp.setColor(colorTypeValue);
                tileComp.setText(tiles[i][j].countColorFill.toString());
                tileComp.setTextOpacity(isTop ? 1 : 0.5);
                isTop = false;


                !this.cache.tileMapData[i] && (this.cache.tileMapData[i] = []);
                this.cache.tileMapData[i][j] = tileComp;
            }

        }
    }

    generateWaitTiles() {
        // Create one container for all wait tiles
        if (this.waitTileContainer) {
            // If already exists, clear it or remove old children as needed
        } else {
            this.waitTileContainer = instantiate(GameObject3D);
            this.waitTileContainer.transform.position.set(0, 0, 0); // Set position if needed
        }

        const waitTileCount = this.levelObject.tileWaits || 0;
        // Positioning: center them horizontally, z pos moves upward/to the back
        const spacing = 2.2;
        const startX = (waitTileCount - 1) * -spacing * 0.5;
        const posY = 0;
        const posZ = 2; // Place farther back than tiles (greater z)

        for (let i = 0; i < waitTileCount; i++) {
            const waitTile = createTileWait();
            waitTile.transform.position.set(startX + i * spacing, posY, posZ);
            this.waitTileContainer.transform.addChild(waitTile.transform);

            this.cache.waitTileMapData[i] = waitTile;
        }
    }
}