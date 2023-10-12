import Color from "./Color.js";

export default class Renderer2 {
    #width: number;
    #height: number;
    #depth: number;
    #pixels: Uint8ClampedArray;

    constructor(width: number, height: number, depth: number, buffer: SharedArrayBuffer) {
        this.#width = width;
        this.#height = height;
        this.#depth = depth;
        this.#pixels = new Uint8ClampedArray(buffer);
    }

    pixel(x: number, y: number, color: Color): void {
        const redIndex = (x + y * this.#width) * 4;
        this.#pixels[redIndex] = color.r;
        this.#pixels[redIndex + 1] = color.g;
        this.#pixels[redIndex + 2] = color.b;
        this.#pixels[redIndex + 3] = 255;
    }

    depthPixel(x: number, y: number, z: number, color: Color): void {
        let t = z / this.#depth;
        t = Math.min(1, Math.max(0, t));
        let depthColor = Color.interpolate(color, new Color(255, 255, 255), t);
        this.pixel(x, y, depthColor);
    }

    get width(): number {
        return this.#width;
    }

    get height(): number {
        return this.#height;
    }
}