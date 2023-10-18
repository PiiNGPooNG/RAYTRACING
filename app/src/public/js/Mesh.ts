import Triangle from "./Triangle.js";
import Vector3 from "./Vector3.js";

export default class Mesh {
    #triangles: Array<Triangle> = [];

    constructor(triangles: Array<Triangle> = []) {
        this.#triangles = triangles;
    }

    addTriangle(triangle: Triangle): void {
        this.#triangles.push(triangle);
    }

    addTriangles(triangles: Array<Triangle>): void {
        this.#triangles.push(...triangles);
    }

    translate(translation: Vector3): void {
        this.#triangles.forEach((triangle) => {
            triangle.translate(translation);
        });
    }


    get triangles(): Array<Triangle> {
        return this.#triangles;
    }
}