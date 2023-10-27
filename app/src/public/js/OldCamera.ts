import Matrix from "./Matrix.js";

export default class OldCamera {
    private perspective: Matrix;
    private _transform: Matrix;
    private _normalTransform: Matrix;

    constructor(perspective: Matrix) {
        this.perspective = perspective;
        this._transform = perspective;
        this._normalTransform = perspective.partial(3, 3).inverse().transpose();
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
        return new OldCamera(perspective);
    }

    static fromOrthographic(xmag: number, aspectRatio: number, znear: number, zfar: number) {
        const right = xmag;
        const top = right / aspectRatio;
        const orthographic = new Matrix([
            [1 / right, 0, 0, 0],
            [0, 1 / top, 0, 0],
            [0, 0, -2 / (zfar - znear), -(zfar + znear) / (zfar - znear)],
            [0, 0, 0, 1]
        ]);
        return new OldCamera(orthographic);
    }

    moveTo(transform: Matrix) {
        this._transform = this.perspective.mult(transform.inverse());
        this._normalTransform = this.perspective.partial(3, 3).mult(transform.partial(3, 3).inverse()).inverse().transpose();
    }

    get transform() {
        return this._transform;
    }

    get normalTransform() {
        return this._normalTransform;
    }
}