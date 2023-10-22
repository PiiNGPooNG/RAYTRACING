export default class Vector3 {
    constructor(readonly x: number, readonly y: number, readonly z: number) {
    }

    static fromArray(array: Array<number>): Vector3 {
        return new Vector3(array[0], array[1], array[2]);
    }

    add(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    subtract(other: Vector3): Vector3 {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    multiplyBy(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    divideBy(divisor: number): Vector3 {
        return new Vector3(this.x / divisor, this.y / divisor, this.z / divisor);
    }

    negate(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    static determinant(u: Vector3, v: Vector3, w: Vector3): number {
        return u.x * v.y * w.z - u.z * v.y * w.x
            + v.x * w.y * u.z - v.z * w.y * u.x
            + w.x * u.y * v.z - w.z * u.y * v.x
    }

    copy(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    angleTo(other: Vector3) {
        return Math.acos(this.dot(other) / (this.norm() * other.norm()));
    }

    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dot(other: Vector3) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
}