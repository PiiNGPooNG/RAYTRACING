import {DaeMaterial} from "./ColladaTypes";

export default class ColladaMaterialLibrary {
    materials: DaeMaterial[] = [];

    parse(libraryMaterialEl: Element) {
        for (const child of libraryMaterialEl.children) {
            this.parseMaterial(child);
        }
    }

    private parseMaterial(materialEl: Element) {
        const id = materialEl.getAttribute("id");
        const instanceEffectEl = materialEl.querySelector("instance_effect");
        const effect = instanceEffectEl.getAttribute("url");
        this.materials.push({
           id: id,
           effect: effect
        });
    }
}