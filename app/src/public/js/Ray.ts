import Vector3 from "./Vector3.js";
import Triangle from "./Triangle.js";
export default class Ray {
    #origin: Vector3;
    #direction: Vector3;

    #intersection: Vector3;
    #intersectionLambda: number;
    #intersectedTriangle: Triangle;

    constructor(origin: Vector3, direction: Vector3) {
        this.#origin = origin;
        this.#direction = direction;
    }

    static between(from: Vector3, to: Vector3): Ray {
        const direction = to.subtract(from);
        return new Ray(from, direction);
    }

    calcIntersection(triangle: Triangle): void {
        let q = triangle.A.copy();
        let v = triangle.B.subtract(triangle.A);
        let w = triangle.C.subtract(triangle.A);

        let p = this.#origin;
        let u = this.#direction;

        let determinant = Vector3.determinant(u, v.negate(), w.negate());
        if (determinant === 0) {
            return;
        }

        let d = q.subtract(p);
        let lambda = Vector3.determinant(d, v.negate(), w.negate()) / determinant;
        if (lambda <= 1e-10) {
            return;
        }
        if (this.#intersectionLambda && this.#intersectionLambda < lambda) {
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
            this.#intersection = p.add(u.multiplyBy(lambda));
            this.#intersectionLambda = lambda;
            this.#intersectedTriangle = triangle;
        }
    }

    get intersection(): Vector3 {
        return this.#intersection;
    }

    get intersectedTriangle(): Triangle {
        return this.#intersectedTriangle;
    }
}