import Color from "./Color.js";
import Vector3 from "./Vector3.js";

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
}