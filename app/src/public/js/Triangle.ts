import Color from "./Color.js";
import Matrix from "./Matrix.js";
import Vertex from "./Vertex.js";

export default class Triangle {
    private _A: Vertex;
    private _B: Vertex;
    private _C: Vertex;
    readonly color: Color;

    constructor(A: Vertex, B: Vertex, C: Vertex, color: Color) {
        this._A = A;
        this._B = B;
        this._C = C;
        this.color = color;
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

    transform(matrix: Matrix) {
        this._A.transform(matrix);
        this._B.transform(matrix);
        this._C.transform(matrix);
    }
}