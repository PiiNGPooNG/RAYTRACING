export default class Color {
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