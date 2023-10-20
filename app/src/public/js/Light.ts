import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";

export default class Light {
    #position: Vector3;

    constructor(position: Vector3) {
        this.#position = position;
    }

    get position(): Vector3 {
        return this.#position;
    }

    transform(matrix: Matrix) {
        this.#position = matrix.transform(this.#position);
    }
}