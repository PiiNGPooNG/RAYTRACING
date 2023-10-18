import Vector3 from "./Vector3.js";

export default class TransformationMatrix {
    #matrix: Array<Array<number>>

    constructor(matrixArray: Array<number>) {
        this.#matrix = [
            matrixArray.slice(0, 4),
            matrixArray.slice(4, 8),
            matrixArray.slice(8, 12),
            matrixArray.slice(12, 16)
        ];
    }

    getTransformed(v: Vector3) {
        const m = this.#matrix;
        return new Vector3(
            m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3],
            m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3],
            m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3],
        );
    }
}