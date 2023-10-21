import {DaeLight} from "./ColladaTypes";

export default class ColladaLightLibrary {
    lights: DaeLight[] = [];

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
        const color = techniqueEl.querySelector("color").textContent.split(" ").map(Number);
        switch (techniqueEl.children[0].tagName) {
            case "point":
                this.lights.push({
                    id: id,
                    type: "point",
                    color: {
                        r: color[0] / energy,
                        g: color[1] / energy,
                        b: color[2] / energy
                    }
                });
                break;
        }
    }
}