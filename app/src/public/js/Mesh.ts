import Triangle from "./Triangle.js";
import Matrix from "./Matrix.js";

export default class Mesh {
    readonly triangles: Array<Triangle> = [];

    constructor(triangles: Array<Triangle> = []) {
        this.triangles = triangles;
    }

    transform(matrix: Matrix) {
        for (const triangle of this.triangles) {
            triangle.transform(matrix);
        }
    }
}