import {DaeMaterial} from "./ColladaTypes";

export default class ColladaMaterialLibrary {
    materials: DaeMaterial[];

    constructor(materials: DaeMaterial[] = []) {
        this.materials = materials ?? [];
    }

    parse(libraryMaterialEl: Element) {
        for (const child of libraryMaterialEl.children) {
            this.parseMaterial(child);
        }
    }

    private parseMaterial(materialEl: Element) {
        const id = materialEl.getAttribute("id");
        const instanceEffectEl = materialEl.querySelector("instance_effect");
        const effect = instanceEffectEl.getAttribute("url").substring(1);
        this.materials.push({
           id: id,
           effect: effect
        });
    }

    getById(id: string) {
        return this.materials.find(material => {
            return material.id === id;
        });
    }
}