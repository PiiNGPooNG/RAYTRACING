import Triangle from "./Triangle.js";
import {stlFileToTriangles} from "./stlparser.js";
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

    static async fromFile(filename: string): Promise<Mesh> {
        return new Promise(async function (resolve) {
            const mesh = new Mesh(await stlFileToTriangles(filename));
            resolve(mesh);
        });
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