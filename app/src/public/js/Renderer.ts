import Color from "./Color.js";
import Ray from "./Ray.js";
import Vector3 from "./Vector3.js";
import Scene from "./Scene.js";

let counter = 0;

export default class Renderer {
    readonly width: number;
    readonly height: number;
    private readonly pixels: Uint8ClampedArray;

    #scene: Scene;

    constructor(width: number, height: number, buffer: SharedArrayBuffer) {
        this.width = width;
        this.height = height;
        this.pixels = new Uint8ClampedArray(buffer);
    }

    setScene(scene: Scene) {
        this.#scene = scene;
    }

    pixel(x: number, y: number, color: Color): void {
        const redIndex = (x + y * this.width) * 4;
        this.pixels[redIndex] = Math.floor(color.r * 255);
        this.pixels[redIndex + 1] = Math.floor(color.g * 255);
        this.pixels[redIndex + 2] = Math.floor(color.b * 255);
        this.pixels[redIndex + 3] = 255;
    }

    render(startX: number, startY: number, width: number, height: number) {
        const meshes = this.#scene.meshes;
        const dirLights = this.#scene.dirLights;
        for (let x = startX; x < startX + width; x++) {
            for (let y = startY; y < startY + height; y++) {
                let ray = this.#scene.camera.getRay(x, y, this.width, this.height)

                meshes.forEach((mesh) => {
                    mesh.triangles.forEach((triangle) => {
                       ray.calcIntersection(triangle);
                    });
                });
                let intersection = ray.intersection;
                if (intersection) {
                    let light = dirLights[0];
                    let lightRay = new Ray(intersection.position, light.direction);
                    if (counter < 10 && this.#scene.meshes[0].triangles[10] == intersection.triangle) {
                        counter++
                    }
                    meshes.forEach((mesh) => {
                        mesh.triangles.forEach((triangle) => {
                           lightRay.calcIntersection(triangle);
                        });
                    })
                    if (lightRay.intersection === undefined) {
                        let dot = lightRay.direction.angleTo(intersection.triangle.normal);
                        dot = Math.max(dot, 0);
                        //dot = (dot + 1) / 2;
                        let color = ray.intersection.triangle.color.lightAtAngle(light.color, dot);
                        this.pixel(x, y, color);
                    } else {
                        this.pixel(x, y, new Color(0, 0, 0));
                    }
                }
            }
        }
    }
}