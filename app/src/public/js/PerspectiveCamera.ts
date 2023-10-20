import Matrix from "./Matrix.js";

export default class PerspectiveCamera {
    #perspective: Matrix;
    #view: Matrix;

    constructor(xfov: number, aspectRatio: number, znear: number, zfar: number) {
        const right = znear * Math.tan((xfov / 2) * (Math.PI / 180));
        const top = right / aspectRatio;

        this.#perspective = new Matrix([
            [znear / right, 0, 0, 0],
            [0, znear / top, 0, 0],
            [0, 0, -(zfar + znear) / (zfar - znear), 2 * zfar * znear / (znear - zfar)],
            [0, 0, -1, 0]
        ]);
        this.#view = this.#perspective;
    }

    set transform(transform: Matrix) {
        //this.#view = transform.invert().mult(this.#perspective);
        this.#view = this.#perspective.mult(transform.invert());
    }

    get view() {
        return this.#view;
    }
}