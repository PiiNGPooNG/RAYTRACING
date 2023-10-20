import Color from "./Color.js";
import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";

export default class Triangle {
    #A: Vector3;
    #B: Vector3;
    #C: Vector3;
    #color: Color;

    constructor(A: Vector3, B: Vector3, C: Vector3, color: Color) {
        this.#A = A;
        this.#B = B;
        this.#C = C;
        this.#color = color;
    }

    get A(): Vector3 {
        return this.#A;
    }

    get B(): Vector3 {
        return this.#B;
    }

    get C(): Vector3 {
        return this.#C;
    }

    get color(): Color {
        return this.#color;
    }

    translate(translation: Vector3): void {
        this.#A = this.#A.add(translation);
        this.#B = this.#B.add(translation);
        this.#C = this.#C.add(translation)
    }

    transform(matrix: Matrix) {
        this.#A = matrix.transform(this.#A);
        this.#B = matrix.transform(this.#B);
        this.#C = matrix.transform(this.#C);
    }
}