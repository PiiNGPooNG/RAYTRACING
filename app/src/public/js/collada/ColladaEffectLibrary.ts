import {DaeEffect} from "./ColladaTypes";

export default class ColladaEffectLibrary {
    effects: DaeEffect[];

    constructor(effects: DaeEffect[] = []) {
        this.effects = effects ?? [];
    }

    parse(libraryEffectEl: Element) {
        for (const child of libraryEffectEl.children) {
            this.parseEffect(child);
        }
    }

    private parseEffect(effectEl: Element) {
        const id = effectEl.getAttribute("id");
        const techniqueEl = effectEl.querySelector("profile_COMMON technique");
        switch (techniqueEl.children[0].tagName) {
            case "lambert":
                const effect: DaeEffect = {
                    id: id,
                    type: "lambert",
                    properties: {}
                };
                const diffuseEl = techniqueEl.querySelector("diffuse");
                if (diffuseEl) {
                    const color = diffuseEl.querySelector("color").textContent.split(" ").map(Number);
                    effect.properties.diffuse = {
                        r: color[0],
                        g: color[1],
                        b: color[2],
                        a: color[3]
                    };
                }
                const reflectivityEl = techniqueEl.querySelector("reflectivity");
                if (reflectivityEl) {
                    effect.properties.reflectivity = parseFloat(reflectivityEl.querySelector("float").textContent);
                }
                const iorEl = techniqueEl.querySelector("index_of_refraction");
                if (iorEl) {
                    effect.properties.ior = parseFloat(iorEl.querySelector("float").textContent);
                }
                const transparentEl = techniqueEl.querySelector("transparent");
                if (transparentEl) {
                    const color = transparentEl.querySelector("color").textContent.split(" ").map(Number);
                    effect.properties.transparent = {
                        r: color[0],
                        g: color[1],
                        b: color[2],
                        a: color[3]
                    };
                }
                this.effects.push(effect);
                break;
        }
    }

    getById(id: string) {
        return this.effects.find(effect => effect.id === id);
    }
}