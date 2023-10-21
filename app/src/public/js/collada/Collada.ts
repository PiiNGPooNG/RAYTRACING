import {DaeCamera, DaeEffect, DaeGeometry, DaeLight, DaeMaterial, DaeScene, DaeVisualScene} from "./ColladaTypes";
import ColladaGeometryLibrary from "./ColladaGeometryLibrary.js";
import ColladaLightLibrary from "./ColladaLightLibrary.js";
import ColladaCameraLibrary from "./ColladaCameraLibrary.js";
import ColladaMaterialLibrary from "./ColladaMaterialLibrary.js";
import ColladaEffectLibrary from "./ColladaEffectLibrary";
import ColladaVisualSceneLibrary from "./ColladaVisualSceneLibrary.js";

export default class Collada {
    scene: DaeScene = {};
    visualScenes: ColladaVisualSceneLibrary;
    cameras: ColladaCameraLibrary;
    lights: ColladaLightLibrary;
    effects: ColladaEffectLibrary;
    materials: ColladaMaterialLibrary;
    geometries: ColladaGeometryLibrary;

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

    parse(colladaEl: Element) {
        for (const child of colladaEl.children) {
            switch (child.tagName) {
                case "scene":
                    const instanceVisualSceneEl = child.querySelector("instance_visual_scene")
                    this.scene.visual = instanceVisualSceneEl.getAttribute("url").substring(1);
                    break;

                case "library_visual_scenes":
                    this.visualScenes = new ColladaVisualSceneLibrary();
                    this.visualScenes.parse(child);
                    break;

                case "library_cameras":
                    this.cameras = new ColladaCameraLibrary();
                    this.cameras.parse(child);
                    break;

                case "library_lights":
                    this.lights = new ColladaLightLibrary();
                    this.lights.parse(child);
                    break;

                case "library_effects":
                    this.effects = new ColladaEffectLibrary();
                    this.effects.parse(child);
                    break;

                case "library_materials":
                    this.materials = new ColladaMaterialLibrary();
                    this.materials.parse(child);
                    break;

                case "library_geometries":
                    this.geometries = new ColladaGeometryLibrary();
                    this.geometries.parse(child);
                    break;
            }
        }
    }

    getScene(): DaeScene {
        return this.scene;
    }

    getVisualScene(id: string): DaeVisualScene {
        return this.visualScenes.getById(id);
    }

    getCamera(id: string): DaeCamera {
        return this.cameras.getById(id);
    }

    getLight(id: string): DaeLight {
        return this.lights.getById(id);
    }

    getEffect(id: string): DaeEffect {
        return this.effects.getById(id);
    }

    getEffectByMaterial(materialId: string): DaeEffect {
        return this.effects.getById(this.materials.getById(materialId).effect);
    }

    getMaterial(id: string): DaeMaterial {
        return this.materials.getById(id);
    }
    getGeometry(id: string): DaeGeometry {
        return this.geometries.getById(id);
    }
}