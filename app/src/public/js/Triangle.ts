import Color from "./Color.js";
import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";

export default class Triangle {
    private _A: Vector3;
    private _B: Vector3;
    private _C: Vector3;
    private _normal: Vector3;
    readonly color: Color;

    constructor(A: Vector3, B: Vector3, C: Vector3, normal: Vector3, color: Color) {
        this._A = A;
        this._B = B;
        this._C = C;
        this._normal = normal;
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

    get normal(): Vector3 {
        return this._normal;
    }

    transform(matrix: Matrix) {
        this._A = matrix.transform(this._A);
        this._B = matrix.transform(this._B);
        this._C = matrix.transform(this._C);
        this._normal = matrix.transform(this._normal);
    }
}