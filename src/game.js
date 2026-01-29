import { AmbientLight, DirectionalLight } from "@three.alias";
import { GameObject3D, world } from "engine-ts/dist";
import { three } from "engine-ts/dist/core/render/three-renderer";
import { Asset, loadAssets } from "scripts/_load-assets/AssetLoader";
import { loadMaterials } from "scripts/_load-assets/MaterialFactory";



// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    await loadAssets();
    await loadMaterials();
    await world.init({ three: three });

    // Add lights for MeshToonMaterial
    const ambientLight = new AmbientLight(0xffffff, 0.6);
    const directionalLight = new DirectionalLight(0xffffff, 0.8);
    three.scene.add(ambientLight);
    three.scene.add(directionalLight);

    const go = new GameObject3D();
    const text = go.add.text3D(Asset.FONT_TEST, { align: 'center' });
    text.scale.set(0.01, 0.01, 0.01);
    text.setText("5");
    // go.add.mesh(new BoxGeometry(3, 3, 3), Material.SQUID); 

    // three.scene.add(new Text3D(Asset.FONT_TEST, { text: "1" }));
    three.scene.add(go.node);

}
