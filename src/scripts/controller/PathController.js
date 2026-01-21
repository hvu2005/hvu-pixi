import { GameObject3D, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { BoxGeometry, CircleGeometry } from "@three.alias";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
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
                    { x: 4, y: 2, z: -1.9 },
                ]
            },
            {
                type: 'curve',
                points: [
                    { x: 4.55, y: 2, z: -1.98 },
                    { x: 5, y: 2, z: -2.1 },
                    { x: 5.6, y: 2, z: -2.5 },
                    { x: 6, y: 2, z: -3 },
                    { x: 6.1, y: 2, z: -3.5 },
                ]
            },
            {
                type: 'straight',
                points: [
                    { x: 6.2, y: 2, z: -4 },
                    { x: 6.2, y: 2, z: -16 },
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
     * Di chuyển tileEntity tuần tự qua các path với speed cao hơn mặc định.
     * Nếu path.type === 'curve', vừa xoay Y += Math.PI/2 vừa di chuyển (xoay _đồng thời_ với di chuyển, dùng gsap).
     * Không dùng requestAnimationFrame. Tự động chuyển path tiếp theo cho đến hết.
     * Chỉ 1 tileEntity, không cần truyền index.
     * @param {GameObject3D} tileEntity
     * @param {Object} option 
     */
    async moveAlongAllPaths(tileEntity, option = { speed: 5 }) {
        if (!tileEntity._movePathState) tileEntity._movePathState = {};
        const moveState = tileEntity._movePathState;
        moveState.canceled = false;
    
        const speed = option.speed ?? 5;
    
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
    
            const duration = totalDist / (speed > 0 ? speed : 1);
    
            // ===== xác định rotation target =====
            let rotationPromise = Promise.resolve();
    
            if (pathType === "curve") {
                const rot = tileEntity.transform.rotation;
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
                gsap.to(tileEntity.transform.position, {
                    duration,
                    ease: "none",
                    motionPath: {
                        path: points,
                        
                    },
                    onComplete: res,
                });
            });
    
            // ===== CHẠY ĐỒNG THỜI =====
            await Promise.all([movePromise, rotationPromise]);
        }
    }
    

    /**
     * Đưa tileEntity tới điểm bắt đầu nếu chưa ở đó, sau đó gọi moveAlongAllPaths.
     * @param {GameObject3D} tileEntity
     * @param {Object} option 
     */
    async moveToConveyor(tileEntity, option = { speed: 5 }) {
        const firstPath = this.paths[0];
        if (!firstPath || !firstPath.points) return;
        const firstPoint = firstPath.points[0];
        const from = tileEntity.transform.position;

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
            });
        }
        return this.moveAlongAllPaths(tileEntity, option);
    }
}
