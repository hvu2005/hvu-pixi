
import { Scene } from "engine/shared/scene/Scene";
import {
    Asset,
    Collider3D,
    Collider3DShape,
    // MeshRenderer, 
    // Collider3D, 
    // collision3DManager, 
    // Collider3DShape, 
    // GameObject3D, 
    GameObject,
    GameObject3D,
    MeshRenderer,
    SpriteRenderer,
    appEngine,
    collision3DManager,
    collisionManager
} from "@engine";
// import { Model3DTest } from "scripts/Model3DTest";
// import { Model3DTest2 } from "scripts/Model3DTest2";
import { Model2DTest } from "scripts/Model2DTest";
import { BoxCollider } from "engine/shared/components/pixi/physic/colliders/BoxCollider";
import { Model3DTest2 } from "scripts/Model3DTest2";
import { Model3DTest } from "scripts/Model3DTest";


export class GameScene extends Scene {
    /**
     * @override
     */
    sceneTree() {
        collision3DManager.debug = true;
        collisionManager.debug = true;
        appEngine.debug = true;

        this.game();
    }

    game() {

        const obj2DParent = GameObject.instantiate(GameObject);

        const obj2D = GameObject.instantiate(GameObject);
        obj2D.addComponent(new SpriteRenderer(Asset.ITEM_1));
        // obj2D.addComponent(new PolygonCollider({ 
        //     points: [{x:0,y:0}, {x:150,y:0}, {x:125,y:140}, {x:25,y:140}, {x:0,y:70}, {x:250, y: 120}, {x:200,y:200}], 
        //     isSensor: false, 
        //     isStatic: false 
        // }));
        obj2D.addComponent(new BoxCollider({ width: 100, height: 200, isSensor: false, isStatic: false }));
        obj2D.addComponent(new Model2DTest());
        obj2D.position.set(500, 300);
        obj2D.rotation = Math.PI / 2;



        obj2DParent.addChild(obj2D);
        obj2DParent.rotation = Math.PI / 3;
        obj2DParent.removeChild(obj2D);


        obj2DParent.position.set(50, 50);

        const obj2D2 = GameObject.instantiate(GameObject);
        obj2D2.addComponent(new SpriteRenderer(Asset.ITEM_1));
        obj2D2.addComponent(new BoxCollider({ width: 100, height: 200, isSensor: false, isStatic: true }));
        obj2D2.position.set(450, 1000);







        const obj3Dparent = GameObject3D.instantiate(GameObject3D);
        obj3Dparent.position.set(5, -5);

        const obj3D = GameObject3D.instantiate(GameObject3D);
        obj3D.addComponent(new MeshRenderer(Asset.CAKE, {
            scale: 150,
            position: [0, 0, 0]
        }));

        // obj3D.addComponent(new Model3DTest());
        obj3D.addComponent(new Collider3D({
            width: 100,
            height: 10,
            depth: 10,
            label: 'Cube',
            isStatic: true,
            shapeType: Collider3DShape.Box,
            isSensor: false
        }));
        

        const obj3D2 = GameObject3D.instantiate(GameObject3D);

        obj3D2.addComponent(new MeshRenderer(Asset.CAKE, {
            scale: 150,
            position: [0, 0, 0]
        }));


        obj3D2.addComponent(new Model3DTest2());

        obj3D2.position.set(5, 20, 0);

        obj3D2.addComponent(new Collider3D({
            offset: { y: 5 },
            radius: 5,
            label: 'Cube',
            isStatic: false,
            shapeType: Collider3DShape.Sphere,
            isSensor: false,
            restitution: 5,
            friction: 0,
        }));

        obj3Dparent.addChild(obj3D2);

    }
}
