import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";
import Ray from "./Ray.js";
import {Camera} from "./types";

export default class PerspectiveCamera implements Camera {
    private readonly right: number;
    private readonly top: number;
    readonly viewMatrix: Matrix;

    constructor(xfov: number, aspectRatio: number, transform: Matrix) {
        this.right = Math.tan(xfov / 2 * Math.PI / 180);
        this.top = this.right / aspectRatio;
        this.viewMatrix = transform.inverse();
    }

    getRay(x: number, y: number, width: number, height: number) {
        const origin = new Vector3(0, 0, 0)
        const direction = new Vector3(this.right * 2 / width * x - this.right, this.top - this.top * 2 / height * y, -1);
        return new Ray(origin, direction);
    }
}