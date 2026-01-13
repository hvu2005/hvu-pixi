import { instantiate, GameObject3D } from "engine";
import * as THREE from "three";



export function GameObjecTest3D() {
    const gameObject = instantiate(GameObject3D, { renderOrder: 2, tag: "GameObjectTest3D" });

    const transform = gameObject.transform;

    const group = transform.getNode();

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x547877 });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);


    transform.position.set(0, -1, 0);
    transform.rotation.set(0, 0, 0);
    transform.scale.set(1, 1, 1);

    return gameObject;
}