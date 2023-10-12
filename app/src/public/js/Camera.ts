import Vector3 from "./Vector3.js";

export default class Camera {
    #origin: Vector3;
    #direction: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        this.#origin = origin;
        this.#direction = direction;
    }

    get origin(): Vector3 {
        return this.#origin;
    }

    get direction(): Vector3 {
        return this.#direction;
    }
}