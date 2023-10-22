import {DaeCamera} from "./ColladaTypes";

export default class ColladaCameraLibrary {
    cameras: DaeCamera[];

    constructor(cameras: DaeCamera[] = []) {
        this.cameras = cameras ?? [];
    }

    parse(libraryCamerasEl: Element) {
        for (const child of libraryCamerasEl.children) {
            this.parseCamera(child);
        }
    }

    private parseCamera(cameraEl: Element) {
        const id = cameraEl.getAttribute("id");
        const opticsEl = cameraEl.querySelector("optics");
        const techniqueEl = opticsEl.querySelector("technique_common");
        switch (techniqueEl.children[0].tagName) {
            case "perspective":
                const perspectiveEl = techniqueEl.children[0];
                this.cameras.push({
                    id: id,
                    type: "perspective",
                    optics: {
                        xfov: parseFloat(perspectiveEl.querySelector("xfov").textContent),
                        aspectRatio: parseFloat(perspectiveEl.querySelector("aspect_ratio").textContent),
                        znear: parseFloat(perspectiveEl.querySelector("znear").textContent),
                        zfar: parseFloat(perspectiveEl.querySelector("zfar").textContent)
                    }
                });
                break;
        }
    }

    getById(id: string) {
        return this.cameras.find(camera => {
            return camera.id === id;
        });
    }
}