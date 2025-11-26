import { MonoBehaviour } from "@engine";
import { MeshRenderer } from "@engine";
import { Quaternion, Vector3 } from '@three.alias';




export class Model3DTest2 extends MonoBehaviour {
    start() {

        this.meshRenderer = this.getComponent(MeshRenderer);
        this.count = 0;

        // this.meshRenderer.mesh.rotation.x = Math.PI / 3;
    }

    update(dt) {
        // Tạo quaternion quay quanh trục Y
        const q = new Quaternion();
        q.setFromAxisAngle(new Vector3(0, 1, 0), 0.5 * dt);

        // Nhân vào quaternion hiện tại của mesh (Three.js)
        this.gameObject.quaternion.multiply(q);
    }

    onTriggerEnter(other) {
        if (++this.count > 3) {
            this.gameObject.position.set(5, 20, 0);
            this.count = 0;
        }
    }

    onTriggerExit(other) {

    }
}
