import Color from "./Color.js";
import Scene from "./Scene.js";
import Ray from "./Ray";

let counter = 0;

export default class Renderer {
    readonly width: number;
    readonly height: number;
    private readonly pixels: Uint8ClampedArray;

    private scene: Scene;

    constructor(width: number, height: number, buffer: SharedArrayBuffer) {
        this.width = width;
        this.height = height;
        this.pixels = new Uint8ClampedArray(buffer);
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    pixel(x: number, y: number, color: Color): void {
        const redIndex = (x + y * this.width) * 4;
        this.pixels[redIndex] = Math.floor(color.r * 255);
        this.pixels[redIndex + 1] = Math.floor(color.g * 255);
        this.pixels[redIndex + 2] = Math.floor(color.b * 255);
        this.pixels[redIndex + 3] = 255;
    }

    render(startX: number, startY: number, width: number, height: number) {
        for (let x = startX; x < startX + width; x++) {
            for (let y = startY; y < startY + height; y++) {
                let ray = this.scene.camera.getRay(x, y, this.width, this.height)
                this.pixel(x, y, this.getColor(ray, 0));
            }
        }
    }

    getColor(ray: Ray, depth: number) {
        const meshes = this.scene.meshes;
        const lights = this.scene.lights;

        for (const mesh of meshes) {
            for (const triangle of mesh.triangles) {
                ray.calcIntersection(triangle);
            }
        }

        let intersection = ray.intersection;
        if (intersection) {
            let material = ray.intersection.triangle.material;
            let finalColor = new Color(0, 0, 0);
            let minColor = new Color(material.color.r * 0.2, material.color.g * 0.2, material.color.b * 0.2);
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
                    let color = material.color.lightAtAngle(light.color, dot);
                    finalColor.add(color);
                }
            }
            return finalColor;
        }

        return new Color(0.53, 0.81, 0.92);
    }
}