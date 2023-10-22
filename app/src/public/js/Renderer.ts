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
        this.#pixels[redIndex] = Math.floor(color.r * 255);
        this.#pixels[redIndex + 1] = Math.floor(color.g * 255);
        this.#pixels[redIndex + 2] = Math.floor(color.b * 255);
        this.#pixels[redIndex + 3] = 255;
    }

    depthPixel(x: number, y: number, z: number, color: Color): void {
        let t = z / this.#depth;
        t = Math.min(1, Math.max(0, t));
        let depthColor = Color.interpolate(color, new Color(1, 1, 1), t);
        this.pixel(x, y, depthColor);
    }

    get width(): number {
        return this.#width;
    }

    get height(): number {
        return this.#height;
    }

    render(startX: number, startY: number, width: number, height: number) {
        const meshes = this.#scene.meshes;
        const lights = this.#scene.lights;
        for (let x = startX; x < startX + width; x++) {
            for (let y = startY; y < startY + height; y++) {
                let ray = new Ray(
                    new Vector3(2 / this.#width * x - 1, 1 - 2 / this.#height * y, -1),
                    new Vector3(0, 0, 1)
                );

                meshes.forEach((mesh) => {
                    mesh.triangles.forEach((triangle) => {
                       ray.calcIntersection(triangle);
                    });
                });
                let intersection = ray.intersection;
                if (intersection) {
                    let lightRay = Ray.between(intersection.position, lights[0].position);
                    meshes.forEach((mesh) => {
                        mesh.triangles.forEach((triangle) => {
                           lightRay.calcIntersection(triangle);
                        });
                    })
                    if (lightRay.intersection == undefined) {
                        const angle = lightRay.direction.angleTo(intersection.triangle.normal);
                        let color = ray.intersection.triangle.color.lightAtAngle(new Color(1, 1, 1), angle);
                        this.pixel(x, y, color);
                    } else {
                        this.pixel(x, y, new Color(0, 0, 0));
                    }
                }
            }
        }
    }
}