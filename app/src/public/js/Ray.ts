import Vector3 from "./Vector3.js";
import Triangle from "./Triangle.js";
export default class Ray {
    readonly origin: Vector3;
    readonly direction: Vector3;
    private _intersection: Intersection;

    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin;
        this.direction = direction;
    }

    static between(from: Vector3, to: Vector3): Ray {
        const direction = to.subtract(from);
        return new Ray(from, direction);
    }

    calcIntersection(triangle: Triangle): void {
        let q = triangle.A.position.copy();
        let v = triangle.B.position.subtract(triangle.A.position);
        let w = triangle.C.position.subtract(triangle.A.position);

        let p = this.origin;
        let u = this.direction;

        let determinant = Vector3.determinant(u, v.negate(), w.negate());
        if (determinant === 0) {
            return;
        }

        let d = q.subtract(p);
        let lambda = Vector3.determinant(d, v.negate(), w.negate()) / determinant;
        if (lambda <= 1e-10) {
            return;
        }
        if (this._intersection && this._intersection.lambda < lambda) {
            return;
        }

        let mu = Vector3.determinant(u, d, w.negate()) / determinant;
        if (mu <= 0) {
            return;
        }

        let nu = Vector3.determinant(u, v.negate(), d) / determinant;
        if (nu <= 0) {
            return;
        }

        if (mu + nu < 1) {
            this._intersection = {
                position: p.add(u.multiplyBy(lambda)),
                lambda: lambda,
                triangle: triangle
            }
        }
    }

    get intersection(): Intersection {
        return this._intersection;
    }
}

interface Intersection {
    position: Vector3;
    triangle: Triangle;
    lambda: number;
}