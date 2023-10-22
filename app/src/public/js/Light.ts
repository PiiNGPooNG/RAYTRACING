import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";

export default class Light {
    private _position: Vector3;

    constructor(position: Vector3) {
        this._position = position;
    }

    get position(): Vector3 {
        return this._position;
    }

    transform(matrix: Matrix) {
        this._position = matrix.transform(this._position);
    }
}