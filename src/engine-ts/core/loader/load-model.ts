// import { GLTFLoader, Group } from "engine/alias/three-alias";
// import { GameObject3DNew } from "../scene-graph/game-object-3d-new";


// export async function loadModelAsGameObject(src) {
//     const loader = new GLTFLoader();
//     const gltf = await loader.loadAsync(src);


//     return _convertGLTFToGameObject(gltf.scene);
// }


// function _convertGLTFToGameObject(gltfScene) {

//     // GameObject cha đại diện cho model
//     const rootGO = new GameObject3DNew();
//     rootGO._addObject(new Group());

//     const nodeToGO = new Map();

//     // 1️⃣ Traverse tạo GameObject cho mỗi Mesh
//     gltfScene.traverse(node => {
//         if (!node.isMesh) return;

//         // Clone mesh để tách khỏi asset graph
//         const mesh = node.clone();
//         mesh.geometry = node.geometry;
//         mesh.material = node.material;

//         // Set LOCAL transform (giữ quan hệ cha–con)
//         mesh.position.copy(node.position);
//         mesh.quaternion.copy(node.quaternion);
//         mesh.scale.copy(node.scale);

//         const go = new GameObject3DNew();
//         go._addObject(mesh);

//         nodeToGO.set(node, go);
//     });

//     // 2️⃣ Rebuild hierarchy gameplay
//     nodeToGO.forEach((go, node) => {
//         const parent = node.parent;

//         if (nodeToGO.has(parent)) {
//             // parent cũng là mesh → gắn vào GO cha
//             nodeToGO.get(parent).addChild(go);
//         } else {
//             // không có parent mesh → gắn vào root model GO
//             rootGO.addChild(go);
//         }
//     });

//     return rootGO;
// }