import Mesh from "./Mesh.js";

export default class Scene {
    #meshes: Array<Mesh> = [];

    constructor() {
    }

    addMesh(mesh: Mesh): void {
        this.#meshes.push(mesh);
    }
}