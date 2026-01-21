import { GameObject3D, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { CircleGeometry } from "@three.alias";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { eventEmitter } from "scripts/_core/EventEmitter";
import { GameEventType } from "scripts/_core/GameEventType";
gsap.registerPlugin(MotionPathPlugin);
/**
 * Tạo path controller, quản lý các đường đi và điều khiển vật thể di chuyển trên path.
 */
export function createPathController() {
    const go = instantiate(GameObject3D, {
        components: [
            new PathController()
        ]
    });

    return go;
}

export class PathController extends MonoBehaviour {
    /**
     * @type {PathController}
     */
    static instance;

    /**
     * @type {Array<{type: string, points: Array<{x: number, y: number, z: number}>}>}
     * paths là mảng các đường (mỗi đường là object với type và points - mảng các điểm 3D)
     */
    paths = [];

    awake() {
        PathController.instance = this;

        // VD: các path mẫu
        this.paths = [
            {
                type: 'straight',
                points: [
                    { x: -7, y: 2, z: -1.9 },
                    { x: 5, y: 2, z: -1.9 },
                ]
            },
            {
                type: 'curve',
                points: [
                    { x: 5, y: 2, z: -1.9 },
                    { x: 6.2, y: 2, z: -2.1 },
                    { x: 6.6, y: 2, z: -3 },
                    { x: 6.2, y: 2, z: -4 },
                ]
            },
            {
                type: 'straight',
                points: [
                    { x: 6.2, y: 2, z: -4 },
                    { x: 6.2, y: 2, z: -16.4 },
                ]
            },
            {
                type: 'curve',
                points: [
                    { x: 6.2, y: 2, z: -16.4 },
                    { x: 6, y: 2, z: -17.6 },
                    { x: 5.1, y: 2, z: -18 },
                    { x: 4.1, y: 2, z: -17.6 },

                ]
            },
            {
                type: 'straight',
                points: [
                    { x: 4.1, y: 2, z: -17.6 },
                    { x: -5.0, y: 2, z: -17.6 },

                ]
            },
            {
                type: 'curve',
                points: [
                    { x: -5.0, y: 2, z: -17.6 },
                    { x: -6.1, y: 2, z: -17.4 },
                    { x: -6.5, y: 2, z: -16.5 },
                    { x: -6.1, y: 2, z: -15.5 },
                ]
            },
            {
                type: 'straight',
                points: [
                    { x: -6.1, y: 2, z: -15.5 },
                    { x: -6.1, y: 2, z: -5 },

                ]
            },
        ];
    }

    start() {
        // Hiện debug path
        this._doDebug();
    }

    _doDebug() {
        this.paths.forEach(path => {
            path.points.forEach(point => {
                const go = instantiate(GameObject3D, {
                    components: [
                        new MeshRenderer(new CircleGeometry(0.2), {
                            material: Material.RED,
                            rotation: [-Math.PI / 2.5, 0, 0],
                        }),
                    ]
                });
                go.transform.position.set(point.x, point.y, point.z);
            });
        });
    }

    /**
     * Di chuyển go tuần tự qua các path với speed cao hơn mặc định.
     * Nếu path.type === 'curve', vừa xoay Y += Math.PI/2 vừa di chuyển (xoay _đồng thời_ với di chuyển, dùng gsap).
     * Không dùng requestAnimationFrame. Tự động chuyển path tiếp theo cho đến hết.
     * Chỉ 1 go, không cần truyền index.
     * @param {GameObject3D} go
     * @param {Object} option 
     */
    async moveAlongAllPaths(go, option = { speed: 8 }) {
        if (!go._movePathState) go._movePathState = {};
        const moveState = go._movePathState;
        moveState.canceled = false;

        const speed = option.speed ?? 8;

        for (let pathIdx = 0; pathIdx < this.paths.length; pathIdx++) {
            if (moveState.canceled) return;

            const pathObj = this.paths[pathIdx];
            const { type: pathType, points } = pathObj;

            if (!points || points.length < 2) continue;

            // ===== tính tổng chiều dài path =====
            let totalDist = 0;
            for (let i = 0; i < points.length - 1; i++) {
                const a = points[i];
                const b = points[i + 1];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dz = b.z - a.z;
                totalDist += Math.sqrt(dx * dx + dy * dy + dz * dz);
            }

            const duration = totalDist / (speed > 0 ? speed : 1) * 1.4;

            // ===== xác định rotation target =====
            let rotationPromise = Promise.resolve();

            if (pathType === "curve") {
                const rot = go.transform.rotation;
                const startY = rot.y || 0;
                const endY = startY + Math.PI / 2;

                rotationPromise = new Promise(res => {
                    gsap.to(rot, {
                        y: endY,
                        duration,
                        ease: "linear",
                        onComplete: res,
                    });
                });
            }

            // ===== motion path =====
            const movePromise = new Promise(res => {
                gsap.to(go.transform.position, {
                    duration,
                    ease: "linear",
                    motionPath: {
                        path: points,
                        curviness: 0,
                        type: pathType === "curve" ? "cubic" : "catmullRom",
                    },
                    onComplete: res,
                });
            });

            // ===== CHẠY ĐỒNG THỜI =====
            await Promise.all([movePromise, rotationPromise]);
        }

        eventEmitter.emit(GameEventType.PATH_COMPLETED, go);
    }


    /**
     * Đưa go tới điểm bắt đầu nếu chưa ở đó, sau đó gọi moveAlongAllPaths.
     * @param {GameObject3D} go
     * @param {Object} option 
     */
    async moveToConveyor(go, option) {
        const firstPath = this.paths[0];
        if (!firstPath || !firstPath.points) return;
        const firstPoint = firstPath.points[0];
        const from = go.transform.position;

        if (
            Math.abs(from.x - firstPoint.x) > 1e-4 ||
            Math.abs(from.y - firstPoint.y) > 1e-4 ||
            Math.abs(from.z - firstPoint.z) > 1e-4
        ) {
            await new Promise(resolve => {
                gsap.to(from, {
                    x: firstPoint.x,
                    y: firstPoint.y,
                    z: firstPoint.z,
                    duration: 0.3,
                    ease: "power1.inOut",
                    onComplete: resolve,
                });

                gsap.to(go.transform.rotation, {
                    y: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                });
            });
        }
        return this.moveAlongAllPaths(go, option);
    }
}
