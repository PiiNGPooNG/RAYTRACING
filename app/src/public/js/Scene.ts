import Mesh from "./Mesh.js";
import Camera from "./Camera";

export default class Scene {
    #camera: Camera;
    #meshes: Array<Mesh> = [];

    constructor(camera: Camera) {
        this.#camera = camera;
    }

    addMesh(mesh: Mesh): void {
        this.#meshes.push(mesh);
    }

    get meshes(): Array<Mesh> {
        return this.#meshes;
    }

    get camera(): Camera {
        return this.#camera;
    }
}