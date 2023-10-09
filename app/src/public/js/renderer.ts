export class Canvas {
    #canvas: HTMLCanvasElement;
    #ctx: CanvasRenderingContext2D;

    #depth: number;
    #background: Color;

    constructor(canvas: HTMLCanvasElement, width: number, height: number, depth: number, background: Color) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        this.#depth = depth;
        this.#background = background;
        this.fill(background);
    }

    size(width: number, height: number) {
        this.#canvas.width = width;
        this.#canvas.height = height;
    }

    fill(color: Color) {
        this.#ctx.fillStyle = color.rgb;
        this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    pixel(x: number, y: number, color: Color) {
        this.#ctx.fillStyle = color.rgb;
        this.#ctx.fillRect(x, y, 1, 1);
    }

    depthPixel(x: number, y: number, z: number, color: Color) {
        let t = z / this.#depth;
        t = Math.min(1, Math.max(0, t));
        let depthColor = Color.interpolate(color, this.#background, t);
        this.pixel(x, y, depthColor);
    }

    get width() {
        return this.#canvas.width;
    }

    get height() {
        return this.#canvas.height;
    }
}

export class Color {
    #r: number;
    #g: number;
    #b: number;

    constructor(r: number, g: number, b: number) {
        this.#r = Math.min(255, Math.max(0, r));
        this.#g = Math.min(255, Math.max(0, g));
        this.#b = Math.min(255, Math.max(0, b));
    }

    get r(): number {
        return this.#r;
    }

    get g(): number {
        return this.#g;
    }

    get b(): number {
        return this.#b;
    }

    get rgb(): string {
        return `rgb(${this.#r}, ${this.#g}, ${this.#b})`;
    }

    static interpolate(color1: Color, color2: Color, t: number): Color {
        return new Color(
            (1 - t) * color1.#r + t * color2.#r,
            (1 - t) * color1.#g + t * color2.#g,
            (1 - t) * color1.#b + t * color2.#b
        )
    }
}

export class Vector3 {
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

    static determinant(u: Vector3, v: Vector3, w: Vector3) {
        return u.#x * v.#y * w.#z - u.#z * v.#y * w.#x
            + v.#x * w.#y * u.#z - v.#z * w.#y * u.#x
            + w.#x * u.#y * v.#z - w.#z * u.#y * v.#x
    }

    copy(): Vector3 {
        return new Vector3(this.#x, this.#y, this.#z);
    }
}

export class Triangle {
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

    drawWireframe(canvas: Canvas) {
        let black = new Color(0, 0, 0);
        let edgeAtoB: Vector3 = this.#B.subtract(this.#A);
        let edgeBtoC: Vector3 = this.#C.subtract(this.#B);
        let edgeCtoA: Vector3 = this.#A.subtract(this.#C);
        for (let d = 0; d < 1; d += 0.001) {
            canvas.pixel(this.#A.x + edgeAtoB.x * d, this.#A.y + edgeAtoB.y * d, black);
            canvas.pixel(this.#B.x + edgeBtoC.x * d, this.#B.y + edgeBtoC.y * d, black);
            canvas.pixel(this.#C.x + edgeCtoA.x * d, this.#C.y + edgeCtoA.y * d, black);
        }
    }
}

export class Ray {
    #origin: Vector3;
    #direction: Vector3;

    #intersection: Vector3;
    #intersectionLambda: number;
    #intersectedTriangle: Triangle;

    constructor(origin: Vector3, direction: Vector3) {
        this.#origin = origin;
        this.#direction = direction;
    }

    calcIntersection(triangle: Triangle) {
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
        if (lambda <= 0) {
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