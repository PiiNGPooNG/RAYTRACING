import Mesh from "./Mesh.js";
import Camera from "./Camera.js";
import Light from "./Light.js";

export default class Scene {
    #camera: Camera;
    #meshes: Mesh[] = [];
    #lights: Light[] = [];

    constructor(camera: Camera) {
        this.#camera = camera;
    }

    addMesh(mesh: Mesh): void {
        this.#meshes.push(mesh);
    }

    addLight(light: Light): void {
        this.#lights.push(light);
    }

    get meshes(): Mesh[] {
        return this.#meshes;
    }

    get lights(): Light[] {
        return this.#lights;
    }

    get camera(): Camera {
        return this.#camera;
    }
}