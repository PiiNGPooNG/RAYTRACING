export default class Vector3 {
    constructor(readonly x: number, readonly y: number, readonly z: number) {
    }

    static fromArray(array: number[]): Vector3 {
        return new Vector3(array[0], array[1], array[2]);
    }

    static asNormal(x: number, y: number, z: number): Vector3 {
        let norm = Math.sqrt(x * x + y * y + z * z);
        return new Vector3(x / norm, y / norm, z / norm);
    }

    asArray(): number[] {
        return [this.x, this.y, this.z];
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

    normalized(): Vector3 {
        const norm = this.norm();
        return new Vector3(this.x / norm, this.y / norm, this.z / norm);
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
        return this.dot(other) / (this.norm() * other.norm());
    }

    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dot(other: Vector3) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross(other: Vector3) {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }
}