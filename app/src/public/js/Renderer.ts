import Color from "./Color.js";
import Scene from "./Scene.js";
import Ray from "./Ray.js";
import Matrix from "./Matrix.js";

let counter = 0;

export default class Renderer {
    readonly width: number;
    readonly height: number;
    private readonly pixels: Uint8ClampedArray;

    private scene: Scene;

    private backgroundColor = new Color(0.53, 0.81, 0.92);
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
                this.pixel(x, y, this.getColor(ray, 1));
            }
        }
    }

    getColor(ray: Ray, depth: number): Color {
        for (const mesh of this.scene.meshes) {
            for (const triangle of mesh.triangles) {
                ray.calcIntersection(triangle);
            }
        }
        const intersection = ray.intersection;
        if (!intersection) {
            return this.backgroundColor;
        }

        const directColor = this.getDirectColor(ray);
        if (depth >= 5) {
            return directColor;
        }

        let finalColor = directColor;
        const material = intersection.triangle.material;

        if (material.reflectivity > 0) {
            const reflectionColor = this.getReflectedColor(ray, depth);
            const reflectivity = material.reflectivity;
            const nonReflectivity = 1 - reflectivity;
            finalColor = new Color(
                directColor.r * nonReflectivity + reflectionColor.r * reflectivity,
                directColor.g * nonReflectivity + reflectionColor.g * reflectivity,
                directColor.b * nonReflectivity + reflectionColor.b * reflectivity,
            )
        }

        if (material.transparency > 0) {
            const refractionColor = this.getRefractedColor(ray, depth);
            const transparency = material.transparency;
            const opacity = 1 - transparency;
            finalColor = new Color(
                finalColor.r * opacity + refractionColor.r * transparency,
                finalColor.g * opacity + refractionColor.g * transparency,
                finalColor.b * opacity + refractionColor.b * transparency,
            )
        }

        return finalColor;
    }

    private getDirectColor(ray: Ray) {
        const intersection = ray.intersection;
        let material = intersection.triangle.material;
        let directColor = new Color(0, 0, 0);
        let minColor = new Color(material.color.r * 0.2, material.color.g * 0.2, material.color.b * 0.2);
        directColor.add(minColor);
        for (const light of this.scene.lights) {
            let lightRay = light.getRay(intersection.position);
            for (const mesh of this.scene.meshes) {
                for (const triangle of mesh.triangles) {
                    lightRay.calcIntersection(triangle);
                }
            }
            if (lightRay.intersection === undefined) {
                let dot = lightRay.direction.angleTo(intersection.triangle.normal);
                dot = Math.max(dot, 0);
                let color = material.color.lightAtAngle(light.color, dot);
                directColor.add(color);
            }
        }
        return directColor;
    }

    private getReflectedColor(ray: Ray, depth: number) {
        const intersection = ray.intersection;
        const identity = Matrix.identity(3);
        const normalAsMatrix = Matrix.fromVector(intersection.triangle.normal);
        const reflector = identity.add(normalAsMatrix.mult(normalAsMatrix.transpose()).scalarMult(-2));
        const reflectionDirection = reflector.mult(Matrix.fromVector(ray.direction)).asVector();
        const reflectionRay = new Ray(intersection.position, reflectionDirection);
        return this.getColor(reflectionRay, depth + 1);
    }

    private getRefractedColor(ray: Ray, depth: number) {
        // TODO
        return new Color(0, 0, 0);
    }
}