import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";
import Color from "./Color.js";
import ModelViewMatrix from "./ModelViewMatrix.js";
import Ray from "./Ray.js";
import {Light} from "./types";

export default class PointLight implements Light {
    private _position: Vector3;
    private _color: Color;
    private _modelMatrix: Matrix;

    constructor(position: Vector3, color: Color, modelMatrix: Matrix) {
        this._position = position;
        this._color = color;
        this._modelMatrix = modelMatrix;
    }

    get position(): Vector3 {
        return this._position;
    }

    get color(): Color {
        return this._color;
    }

    transform(transform: Matrix) {
        let modelViewMatrix = new ModelViewMatrix(this._modelMatrix, transform);
        this._position = modelViewMatrix.modelView.transform(this._position);
    }

    getRay(from: Vector3): Ray {
        return new Ray(from, this._position.subtract(from));
    }
}