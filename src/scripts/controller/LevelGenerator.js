import { GameObject3D, MonoBehaviour, instantiate } from "engine";
import { ItemColorType } from "scripts/_config/ItemColorType";
import { LEVEL_DATA } from "scripts/model/LevelData";
import { createMapItem, MapItem } from "scripts/model/MapItem";


export function createLevelGenerator() {
    const go = instantiate(GameObject3D);
    go.addComponent(new LevelGenerator());
    return go;
}

class LevelGenerator extends MonoBehaviour {

    /**
     * @type {LevelGenerator}
     */
    static instance;

    awake() {
        LevelGenerator.instance = this;
    }

    start() {
        console.log("1");

        /**
         * @type {LevelObject}
         */
        this.levelObject;
        this.readLevel(LEVEL_DATA);

        this.colorTypes = Object.keys(ItemColorType);
        console.log(this.colorTypes);

        this.generateMap();
    }

    readLevel(lvlData) {
        const w = Math.max(...lvlData.mapItems.map(itemList => itemList.length));
        const h = lvlData.mapItems.length;

        this.levelObject = {
            width: w,
            height: h,
            mapItems: lvlData.mapItems,
            tileWaits: lvlData.tileWaits.length,
            tiles: lvlData.tiles,
        }
    }

    generateMap() {
        const mapItems = this.levelObject.mapItems;
        const designW = 11;
        const designH = 11;
        const w = this.levelObject.width;
        const h = this.levelObject.height;

        const scale = Math.min(designH / h, designW / w);

        this.mapContainer = instantiate(GameObject3D);
        this.mapContainer.transform.scale.set(scale, scale, scale);


        for (let i = 0; i < mapItems.length; i++) {
            for (let j = 0; j < mapItems[i].length; j++) {
                if (!mapItems[i][j].itemColorType) continue;

                const mapItem = createMapItem();
                mapItem.transform.position.set(-7.5 + i, 0, -22 + j);

                const colorTypeKey = this.colorTypes[mapItems[i][j].itemColorType];
                const colorTypeValue = ItemColorType[colorTypeKey];
                mapItem.getComponent(MapItem).setColor(colorTypeValue);
                
                this.mapContainer.transform.addChild(mapItem.transform);
            }
        }
    }

    generateTiles() {

    }

}