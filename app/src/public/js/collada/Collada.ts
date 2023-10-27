import {
    DaeCamera,
    DaeEffect,
    DaeFull,
    DaeGeometry,
    DaeLight,
    DaeMaterial,
    DaeScene,
    DaeVisualScene
} from "./ColladaTypes";
import ColladaGeometryLibrary from "./ColladaGeometryLibrary.js";
import ColladaLightLibrary from "./ColladaLightLibrary.js";
import ColladaCameraLibrary from "./ColladaCameraLibrary.js";
import ColladaMaterialLibrary from "./ColladaMaterialLibrary.js";
import ColladaEffectLibrary from "./ColladaEffectLibrary.js";
import ColladaVisualSceneLibrary from "./ColladaVisualSceneLibrary.js";

export default class Collada {
    scene: DaeScene = {};
    visualSceneLibrary: ColladaVisualSceneLibrary;
    cameraLibrary: ColladaCameraLibrary;
    lightLibrary: ColladaLightLibrary;
    effectLibrary: ColladaEffectLibrary;
    materialLibrary: ColladaMaterialLibrary;
    geometryLibrary: ColladaGeometryLibrary;

    static async fromPath(path: string): Promise<Collada> {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Couldn't fetch ${path}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType !== "model/vnd.collada+xml") {
            throw new Error(`File at path (${path}) is of type '${contentType}', not 'model/vnd.collada+xml'`);
        }
        const text = await response.text();
        return new Promise((resolve) => {
            resolve(this.fromText(text));
        });
    }

    static fromText(text: string): Collada {
        const parser = new DOMParser();
        const document = parser.parseFromString(text, "text/xml");
        return this.fromDocument(document);
    }

    static fromDocument(document: Document): Collada {
        const collada = new Collada();
        collada.parse(document.querySelector("COLLADA"));
        return collada;
    }

    static fromObject(object: DaeFull) {
        const collada = new Collada();
        collada.scene = object.scene;
        collada.visualSceneLibrary = new ColladaVisualSceneLibrary(object.visualScenes);
        collada.cameraLibrary = new ColladaCameraLibrary(object.cameras);
        collada.lightLibrary = new ColladaLightLibrary(object.lights);
        collada.effectLibrary = new ColladaEffectLibrary(object.effects);
        collada.materialLibrary = new ColladaMaterialLibrary(object.materials);
        collada.geometryLibrary = new ColladaGeometryLibrary(object.geometries);
        return collada;
    }

    parse(colladaEl: Element) {
        for (const child of colladaEl.children) {
            switch (child.tagName) {
                case "scene":
                    const instanceVisualSceneEl = child.querySelector("instance_visual_scene")
                    this.scene.visual = instanceVisualSceneEl.getAttribute("url").substring(1);
                    break;

                case "library_visual_scenes":
                    this.visualSceneLibrary = new ColladaVisualSceneLibrary();
                    this.visualSceneLibrary.parse(child);
                    break;

                case "library_cameras":
                    this.cameraLibrary = new ColladaCameraLibrary();
                    this.cameraLibrary.parse(child);
                    break;

                case "library_lights":
                    this.lightLibrary = new ColladaLightLibrary();
                    this.lightLibrary.parse(child);
                    break;

                case "library_effects":
                    this.effectLibrary = new ColladaEffectLibrary();
                    this.effectLibrary.parse(child);
                    break;

                case "library_materials":
                    this.materialLibrary = new ColladaMaterialLibrary();
                    this.materialLibrary.parse(child);
                    break;

                case "library_geometries":
                    this.geometryLibrary = new ColladaGeometryLibrary();
                    this.geometryLibrary.parse(child);
                    break;
            }
        }
    }

    asObject(): DaeFull {
        return {
            scene: this.scene,
            visualScenes: this.visualSceneLibrary?.visualScenes,
            cameras: this.cameraLibrary?.cameras,
            lights: this.lightLibrary?.lights,
            effects: this.effectLibrary?.effects,
            materials: this.materialLibrary?.materials,
            geometries: this.geometryLibrary?.geometries
        }
    }

    getScene(): DaeScene {
        return this.scene;
    }

    getVisualScene(id: string): DaeVisualScene {
        return this.visualSceneLibrary.getById(id);
    }

    getCamera(id: string): DaeCamera {
        return this.cameraLibrary.getById(id);
    }

    getLight(id: string): DaeLight {
        return this.lightLibrary.getById(id);
    }

    getEffect(id: string): DaeEffect {
        return this.effectLibrary.getById(id);
    }

    getEffectByMaterial(materialId: string): DaeEffect {
        return this.effectLibrary.getById(this.materialLibrary.getById(materialId).effect);
    }

    getMaterial(id: string): DaeMaterial {
        return this.materialLibrary.getById(id);
    }
    getGeometry(id: string): DaeGeometry {
        return this.geometryLibrary.getById(id);
    }
}