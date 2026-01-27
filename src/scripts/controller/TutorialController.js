import { GameObject3D, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { BoxGeometry } from "@three.alias";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { LevelGenerator } from "./LevelGenerator";
import { Coroutine } from "scripts/_core/Coroutine";
import { GameController } from "./GameController";
import gsap from "gsap";
import { GameFlowController } from "./GameFlowController";

export function createTutorialController() {
    const go = instantiate(GameObject3D, {
        components: [
            new TutorialController(),
        ]
    });

    return go;
}

export class TutorialController extends MonoBehaviour {
    /**
     * @type {TutorialController}
     */
    static instance;

    awake() {
        TutorialController.instance = this;

        this.tutHand = this._createTutorialHand();
        this.tutMap = { x: 1, y: 0 };
    }


    _createTutorialHand() {
        const go = instantiate(GameObject3D, {
            components: [
                new MeshRenderer(new BoxGeometry(3, 3, 0.01), {
                    material: Material.TUT_HAND,
                    rotation: [-Math.PI / 2.5, 0, Math.PI],
                }),
            ]
        });

        go.transform.position.set(-4.3, 6, 10.3);


        this.gameObject.transform.addChild(go.transform);

        return go;
    }


    async waitUntilFirstClick() {

        gsap.to(this.tutHand.transform.position, {
            z: "-=0.5",
            x: "+=0.5",
            yoyo: true,
            repeat: -1,
            duration: 0.3,
        })

        await Coroutine.waitUntil(() => GameController.instance.clickCount > 0);

        this.tutHand.setActive(false);
        gsap.killTweensOf(this.tutHand.transform.position);
    }

    async waitUntilFirstWaitTile() {
        await Coroutine.waitUntil(() => GameFlowController.instance.waitTileAssignments[0]);
        await Coroutine.waitForSeconds(0.5);

        this.tutHand.setActive(true);
        const targetTile = GameFlowController.instance.waitTileAssignments[0];
        const pos = targetTile.transform.position;
        this.tutHand.transform.position.set(pos.x - 1.8, pos.y + 6, pos.z + 3.2);
        gsap.to(this.tutHand.transform.position, {
            z: "-=0.5",
            x: "+=0.5",
            yoyo: true,
            repeat: -1,
            duration: 0.3,
        })

        await Coroutine.waitUntil(() =>
            Object.values(GameFlowController.instance.waitTileAssignments)
                .some(v => v == null)
        );
        this.tutHand.setActive(false);
        gsap.killTweensOf(this.tutHand.transform.position);
    }

    async start() {
        this.tileEntityMap = LevelGenerator.instance.cache.tileMapData;
        this.targetTile = this.tileEntityMap[this.tutMap.x]?.[this.tutMap.y];
        const pos = this.targetTile?.gameObject.transform.position

        pos && this.tutHand.transform.position.set(pos.x - 1.8, pos.y + 6, pos.z + 3.2);

        await this.waitUntilFirstClick();
        await this.waitUntilFirstWaitTile();
    }

    update(dt) {
    }
}