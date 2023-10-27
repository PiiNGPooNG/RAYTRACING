export default class Color {
    get r(): number {
        return this._r;
    }

    set r(value: number) {
        this._r = value;
    }
    get g(): number {
        return this._g;
    }

    set g(value: number) {
        this._g = value;
    }
    get b(): number {
        return this._b;
    }

    set b(value: number) {
        this._b = value;
    }
    private _r: number;
    private _g: number;
    private _b: number;

    constructor(r: number, g: number, b: number) {
        this._r = Math.min(1, Math.max(0, r));
        this._g = Math.min(1, Math.max(0, g));
        this._b = Math.min(1, Math.max(0, b));
    }

    add(color: Color) {
        this._r = Math.min(1, this._r + color._r);
        this._g = Math.min(1, this._g + color._g);
        this._b = Math.min(1, this._b + color._b);
    }

    static interpolate(color1: Color, color2: Color, t: number): Color {
        return new Color(
            (1 - t) * color1._r + t * color2._r,
            (1 - t) * color1._g + t * color2._g,
            (1 - t) * color1._b + t * color2._b
        )
    }

    lightAtAngle(lightColor: Color, dot: number) {
        return new Color(
            this._r * lightColor._r * dot,
            this._g * lightColor._g * dot,
            this._b * lightColor._b * dot
        );
    }
}