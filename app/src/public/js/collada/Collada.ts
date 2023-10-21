import {DaeScene} from "./ColladaTypes";
import ColladaGeometryLibrary from "./ColladaGeometryLibrary.js";
import ColladaLightLibrary from "./ColladaLightLibrary.js";
import ColladaCameraLibrary from "./ColladaCameraLibrary.js";
import ColladaMaterialLibrary from "./ColladaMaterialLibrary.js";
import ColladaEffectsLibrary from "./ColladaEffectsLibrary.js";
import ColladaVisualSceneLibrary from "./ColladaVisualSceneLibrary.js";

export default class Collada {
    scene: DaeScene = {};
    visualScenes: ColladaVisualSceneLibrary;
    cameras: ColladaCameraLibrary;
    lights: ColladaLightLibrary;
    effects: ColladaEffectsLibrary;
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
                    this.scene.visual = instanceVisualSceneEl.getAttribute("url");
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
                    this.effects = new ColladaEffectsLibrary();
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
}