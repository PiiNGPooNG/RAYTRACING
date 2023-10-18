import Color from "./Color.js";
import Ray from "./Ray.js";
import Vector3 from "./Vector3.js";
import Triangle from "./Triangle.js";
import Scene from "./Scene.js";

export default class Renderer {
    #width: number;
    #height: number;
    #depth: number;
    #pixels: Uint8ClampedArray;

    #scene: Scene;

    constructor(width: number, height: number, depth: number, buffer: SharedArrayBuffer) {
        this.#width = width;
        this.#height = height;
        this.#depth = depth;
        this.#pixels = new Uint8ClampedArray(buffer);
    }

    setScene(scene: Scene) {
        this.#scene = scene;
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

    render(startX: number, startY: number, width: number, height: number) {
        const camera = this.#scene.camera;
        const meshes = this.#scene.meshes;
        for (let x = startX; x < startX + width; x++) {
            for (let y = startY; y < startY + height; y++) {
                let ray = new Ray(camera.origin.add(new Vector3(x/150, y/150, 0)), camera.direction);
                meshes.forEach((mesh) => {
                    mesh.triangles.forEach((triangle) => {
                       ray.calcIntersection(triangle);
                    });
                });
                let intersection = ray.intersection;
                if (intersection) {
                    let color = ray.intersectedTriangle.color;
                    this.depthPixel(x, y, ray.intersection.z, color);
                }
            }
        }
    }
}