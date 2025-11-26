import { input, MonoBehaviour } from "@engine";
import { raycast } from "@engine";
import { MeshRenderer } from "@engine";
import { Vector3, Quaternion } from '@three.alias';


export class Model3DTest extends MonoBehaviour {
    start() {
        /** @type {MeshRenderer} */
        this.meshRenderer = this.getComponent(MeshRenderer);

        this.meshRenderer.mesh.rotation.x = Math.PI / 3;

        console.log(this.meshRenderer.mesh.parent.parent.parent.parent);
    }

    update(dt) {
        // Tạo quaternion quay quanh trục Y
        const q = new Quaternion();
        q.setFromAxisAngle(new Vector3(0, 1, 0), 0.5 * dt);

        // Nhân vào quaternion hiện tại của mesh (Three.js)
        this.gameObject.quaternion.multiply(q);
        

        if(input.isMousePressed(0)) {
            console.log(raycast.intersect());
        }
    }

    onTriggerEnter(other) {

    }

    onTriggerStay(other) {

    }

    onTriggerExit(other) {
    }
}