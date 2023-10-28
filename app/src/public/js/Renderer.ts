import Color from "./Color.js";
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
        const lights = this.#scene.lights;
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
                    let triangleColor = ray.intersection.triangle.color;
                    let finalColor = new Color(0, 0, 0);
                    let minColor = new Color(triangleColor.r * 0.2, triangleColor.g * 0.2, triangleColor.b * 0.2);
                    finalColor.add(minColor);
                    for (const light of lights) {
                        let lightRay = light.getRay(intersection.position);
                        meshes.forEach((mesh) => {
                            mesh.triangles.forEach((triangle) => {
                                lightRay.calcIntersection(triangle);
                            });
                        })
                        if (lightRay.intersection === undefined) {
                            let dot = lightRay.direction.angleTo(intersection.triangle.normal);
                            dot = Math.max(dot, 0);
                            let color = triangleColor.lightAtAngle(light.color, dot);
                            finalColor.add(color);
                        }
                    }
                    this.pixel(x, y, finalColor);
                }
            }
        }
    }
}