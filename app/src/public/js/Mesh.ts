import Triangle from "./Triangle.js";
import Matrix from "./Matrix.js";
import ModelViewMatrix from "./ModelViewMatrix.js";

export default class Mesh {
    readonly triangles: Array<Triangle> = [];
    readonly modelMatrix: Matrix;

    constructor(triangles: Array<Triangle> = [], modelMatrix: Matrix) {
        this.triangles = triangles;
        this.modelMatrix = modelMatrix;
    }

    intoView(viewMatrix: Matrix) {
        let modelViewMatrix = new ModelViewMatrix(this.modelMatrix, viewMatrix);
        for (const triangle of this.triangles) {
            triangle.transform(modelViewMatrix);
        }
    }
}