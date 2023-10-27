import Vector3 from "./Vector3.js";
import ModelViewMatrix from "./ModelViewMatrix.js";

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

    transform(modelViewMatrix: ModelViewMatrix) {
        this._position = modelViewMatrix.modelView.transform(this._position);
        this._normal = modelViewMatrix.normalModelView.transformNormal(this._normal);
    }
}