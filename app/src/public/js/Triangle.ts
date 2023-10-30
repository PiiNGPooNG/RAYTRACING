import Material from "./Material.js";
import Vertex from "./Vertex.js";
import ModelViewMatrix from "./ModelViewMatrix.js";

export default class Triangle {
    private _A: Vertex;
    private _B: Vertex;
    private _C: Vertex;
    readonly material: Material;

    constructor(A: Vertex, B: Vertex, C: Vertex, material: Material) {
        this._A = A;
        this._B = B;
        this._C = C;
        this.material = material;
    }

    get A(): Vertex {
        return this._A;
    }

    get B(): Vertex {
        return this._B;
    }

    get C(): Vertex {
        return this._C;
    }

    get normal() { // TODO: proper implementation for smoothing
        return this._A.normal;
    }

    transform(modelViewMatrix: ModelViewMatrix) {
        this._A.transform(modelViewMatrix);
        this._B.transform(modelViewMatrix);
        this._C.transform(modelViewMatrix);
    }
}