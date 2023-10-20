import Mesh from "./Mesh.js";
import Camera from "./Camera.js";
import Light from "./Light.js";
import PerspectiveCamera from "./PerspectiveCamera.js";

export default class Scene {
    #camera: PerspectiveCamera;
    #meshes: Mesh[] = [];
    #lights: Light[] = [];

    constructor(camera: PerspectiveCamera) {
        this.#camera = camera;
    }

    addMesh(mesh: Mesh): void {
        mesh.triangles.forEach((triangle) => {
            triangle.transform(this.#camera.view);
        });
        this.#meshes.push(mesh);
    }

    addLight(light: Light): void {
        light.transform(this.#camera.view);
        this.#lights.push(light);
    }

    get meshes(): Mesh[] {
        return this.#meshes;
    }

    get lights(): Light[] {
        return this.#lights;
    }

    get camera(): PerspectiveCamera {
        return this.#camera;
    }
}