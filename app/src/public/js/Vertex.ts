import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";

export default class Vertex {
    private _position: Vector3;
    private _normal: Vector3;

    constructor(position: Vector3, normal: Vector3) {
        this._position = position;
        this._normal = normal;
    }

    get position() {
        return this._position;
    }

    get normal(): Vector3 {
        return this._normal;
    }

    transform(matrix: Matrix) {
        this._position = matrix.transform(this._position);
        this._normal = matrix.transform(this._normal);
    }
}