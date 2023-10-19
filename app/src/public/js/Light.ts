import Vector3 from "./Vector3.js";

export default class Light {
    #position: Vector3;

    constructor(position: Vector3) {
        this.#position = position;
    }

    get position(): Vector3 {
        return this.#position;
    }
}