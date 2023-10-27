import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";
import Ray from "./Ray.js";

export default class OrthoCamera {
    private readonly right: number;
    private readonly top: number;
    readonly viewMatrix: Matrix;

    constructor(xmag: number, aspectRatio: number, transform: Matrix) {
        this.right = xmag;
        this.top = xmag / aspectRatio;
        this.viewMatrix = transform.inverse();
    }

    getRay(x: number, y: number, width: number, height: number) {
        const origin = new Vector3(this.right * 2 / width * x - this.right, this.top - this.top * 2 / height * y,0)
        const direction = new Vector3(0, 0, -1);
        return new Ray(origin, direction);
    }
}