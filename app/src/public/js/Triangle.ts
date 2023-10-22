import Color from "./Color.js";
import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";

export default class Triangle {
    private _A: Vector3;
    private _B: Vector3;
    private _C: Vector3;
    readonly color: Color;

    constructor(A: Vector3, B: Vector3, C: Vector3, color: Color) {
        this._A = A;
        this._B = B;
        this._C = C;
        this.color = color;
    }

    get A(): Vector3 {
        return this._A;
    }

    get B(): Vector3 {
        return this._B;
    }

    get C(): Vector3 {
        return this._C;
    }

    translate(translation: Vector3): void {
        this._A = this._A.add(translation);
        this._B = this._B.add(translation);
        this._C = this._C.add(translation)
    }

    transform(matrix: Matrix) {
        this._A = matrix.transform(this._A);
        this._B = matrix.transform(this._B);
        this._C = matrix.transform(this._C);
    }
}