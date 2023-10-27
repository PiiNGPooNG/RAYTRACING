import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";
import Color from "./Color.js";
import ModelViewMatrix from "./ModelViewMatrix.js";

export default class DirLight {
    private _direction: Vector3;
    private _transformedDirection: Vector3;
    private _color: Color;
    private _modelMatrix: Matrix;

    constructor(direction: Vector3, color: Color, modelMatrix: Matrix) {
        this._direction = direction;
        this._color = color;
        this._modelMatrix = modelMatrix;
    }

    get direction(): Vector3 {
        return this._direction;
    }

    get color(): Color {
        return this._color;
    }

    transform(normalTransform: Matrix) {
        let modelViewMatrix = new ModelViewMatrix(this._modelMatrix, normalTransform);
        this._direction = modelViewMatrix.normalModelView.transformNormal(this._direction);
    }
}