import {DaeColor, DaeLight} from "./ColladaTypes";

export default class ColladaLightLibrary {
    lights: DaeLight[];

    constructor(lights: DaeLight[] = []) {
        this.lights = lights ?? [];
    }

    parse(libraryLightEl: Element) {
        for (const child of libraryLightEl.children) {
            this.parseLight(child);
        }
    }

    private parseLight(lightEl: Element) {
        const id = lightEl.getAttribute("id");
        const techniqueEl = lightEl.querySelector("technique_common");
        const extraTechniqueEl = lightEl.querySelector("extra technique");
        let energy = 1;
        if (extraTechniqueEl && extraTechniqueEl.getAttribute("profile") == "blender") {
            energy = parseFloat(extraTechniqueEl.querySelector("energy").textContent);
        }
        const colorArr = techniqueEl.querySelector("color").textContent.split(" ").map(Number);
        let color: DaeColor = {
            r: colorArr[0] / energy,
            g: colorArr[1] / energy,
            b: colorArr[2] / energy
        }
        switch (techniqueEl.children[0].tagName) {
            case "point":
                this.lights.push({
                    id: id,
                    type: "point",
                    color: color
                });
                break;

            case "directional":
                this.lights.push({
                    id: id,
                    type: "directional",
                    color: color
                })
        }
    }

    getById(id: string) {
        return this.lights.find(light => light.id === id);
    }
}