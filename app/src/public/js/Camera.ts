import Matrix from "./Matrix.js";

export default class Camera {
    private perspective: Matrix;
    private _view: Matrix;

    constructor(perspective: Matrix) {
        this.perspective = perspective;
        this._view = perspective;
    }

    static fromPerspective(xfov: number, aspectRatio: number, znear: number, zfar: number) {
        const right = znear * Math.tan((xfov / 2) * (Math.PI / 180));
        const top = right / aspectRatio;
        const perspective = new Matrix([
            [znear / right, 0, 0, 0],
            [0, znear / top, 0, 0],
            [0, 0, -(zfar + znear) / (zfar - znear), 2 * zfar * znear / (znear - zfar)],
            [0, 0, -1, 0]
        ]);
        return new Camera(perspective);
    }

    moveTo(transform: Matrix) {
        this._view = this.perspective.mult(transform.invert());
    }

    get view() {
        return this._view;
    }
}