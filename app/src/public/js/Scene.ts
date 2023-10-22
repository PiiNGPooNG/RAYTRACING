import Mesh from "./Mesh.js";
import Light from "./Light.js";
import Camera from "./Camera.js";

export default class Scene {
    __class = "Scene";
    private readonly _camera: Camera;
    private _meshes: Mesh[] = [];
    private _lights: Light[] = [];

    constructor(camera: Camera) {
        this._camera = camera;
    }

    addMesh(mesh: Mesh): void {
        mesh.transform(this._camera.view);
        this._meshes.push(mesh);
    }

    addLight(light: Light): void {
        light.transform(this._camera.view);
        this._lights.push(light);
    }

    get meshes(): Mesh[] {
        return this._meshes;
    }

    get lights(): Light[] {
        return this._lights;
    }

    get camera(): Camera {
        return this._camera;
    }
}