export default class Vector3 {
    #x: number;
    #y: number;
    #z: number;

    constructor(x: number, y: number, z: number) {
        this.#x = x;
        this.#y = y;
        this.#z = z;
    }

    get x(): number {
        return this.#x;
    }

    get y(): number {
        return this.#y;
    }

    get z(): number {
        return this.#z;
    }

    add(other: Vector3): Vector3 {
        return new Vector3(this.#x + other.#x, this.#y + other.#y, this.#z + other.#z);
    }

    subtract(other: Vector3): Vector3 {
        return new Vector3(this.#x - other.#x, this.#y - other.#y, this.#z - other.#z);
    }

    multiplyBy(scalar: number): Vector3 {
        return new Vector3(this.#x * scalar, this.#y * scalar, this.#z * scalar);
    }

    negate(): Vector3 {
        return new Vector3(-this.#x, -this.#y, -this.#z);
    }

    static determinant(u: Vector3, v: Vector3, w: Vector3): number {
        return u.#x * v.#y * w.#z - u.#z * v.#y * w.#x
            + v.#x * w.#y * u.#z - v.#z * w.#y * u.#x
            + w.#x * u.#y * v.#z - w.#z * u.#y * v.#x
    }

    copy(): Vector3 {
        return new Vector3(this.#x, this.#y, this.#z);
    }
}