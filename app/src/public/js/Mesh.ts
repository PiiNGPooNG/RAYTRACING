import Triangle from "./Triangle.js";
import Matrix from "./Matrix.js";

export default class Mesh {
    readonly triangles: Array<Triangle> = [];

    constructor(triangles: Array<Triangle> = []) {
        this.triangles = triangles;
    }

    transform(transform: Matrix, normalTransform: Matrix) {
        for (const triangle of this.triangles) {
            triangle.transform(transform, normalTransform);
        }
    }
}