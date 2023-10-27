import Mesh from "./Mesh.js";
import PointLight from "./PointLight.js";
import DirLight from "./DirLight.js";
import OrthoCamera from "./OrthoCamera.js";

export default class Scene {
    private readonly _camera: OrthoCamera;
    private _meshes: Mesh[] = [];
    private _lights: PointLight[] = [];
    private _dirLights: DirLight[] = [];

    constructor(camera: OrthoCamera) {
        this._camera = camera;
    }

    addMesh(mesh: Mesh): void {
        mesh.intoView(this._camera.viewMatrix);
        this._meshes.push(mesh);
    }

    addLight(light: PointLight | DirLight): void {
        if (light instanceof  DirLight) {
            light.transform(this._camera.viewMatrix);
            this._dirLights.push(light);
        }
    }

    get meshes(): Mesh[] {
        return this._meshes;
    }

    get lights(): PointLight[] {
        return this._lights;
    }

    get dirLights(): DirLight[] {
        return this._dirLights;
    }

    get camera(): OrthoCamera {
        return this._camera;
    }
}