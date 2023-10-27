import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";
import Color from "./Color.js";

export default class PointLight {
    private _position: Vector3;
    private _color: Color;

    constructor(position: Vector3, color: Color) {
        this._position = position;
        this._color = color;
    }

    get position(): Vector3 {
        return this._position;
    }

    get color(): Color {
        return this._color;
    }

    transform(matrix: Matrix) {
        this._position = matrix.transform(this._position);
    }
}