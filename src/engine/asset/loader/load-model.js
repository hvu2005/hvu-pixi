import { GLTFLoader } from "engine/alias/three-alias";


export async function loadModel(src) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(src);
    const loadedObject = gltf.scene || gltf.scenes[0];

    return loadedObject;
}