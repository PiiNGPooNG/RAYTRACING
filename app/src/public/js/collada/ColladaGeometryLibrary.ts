import {DaeGeometry} from "./ColladaTypes";

export default class ColladaGeometryLibrary {
    geometries: DaeGeometry[];

    constructor(geometries: DaeGeometry[] = []) {
        this.geometries = geometries ?? [];
    }

    parse(libraryGeometryEl: Element) {
        for (const child of libraryGeometryEl.children) {
            this.parseGeometry(child);
        }
    }

    private parseGeometry(geometryEl: Element) {
        const id = geometryEl.getAttribute("id");
        const meshEl = geometryEl.querySelector("mesh");
        const geometry: DaeGeometry = {
            id: id,
            triangles: [],
            sources: []
        };
        const verticesEl = meshEl.querySelector("vertices");
        const verticesSource = verticesEl.querySelector("input[semantic='POSITION']").getAttribute("source").substring(1);
        for (const child of meshEl.children) {
            switch (child.tagName) {
                case "source":
                    geometry.sources.push(this.getParsedSource(child));
                    break;

                case "triangles":
                    geometry.triangles.push(this.getParsedTriangles(child, verticesSource));
                    break;
            }
        }
        this.geometries.push(geometry);
    }

    private getParsedSource(sourceEl: Element) {
        const id = sourceEl.getAttribute("id");
        const accessor = sourceEl.querySelector("technique_common accessor");
        const count = parseInt(accessor.getAttribute("count"));
        let stride = 1;
        if (accessor.hasAttribute("stride")) {
            stride = parseInt(accessor.getAttribute("stride"));
        }
        const source = accessor.getAttribute("source");
        const rawData = sourceEl.querySelector(source).textContent.split(" ").map(Number);
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(rawData.splice(0, stride));
        }
        return {id: id, data: data};
    }

    private getParsedTriangles(trianglesEl: Element, verticesSource: string) {
        const count = parseInt(trianglesEl.getAttribute("count"));
        const material = trianglesEl.getAttribute("material");
        const indices = trianglesEl.querySelector("p").textContent.split(" ").map(Number);
        const inputs = [];
        const inputEls = trianglesEl.querySelectorAll("input");
        for (const [_, inputEl] of inputEls.entries()) {
            const semantic = inputEl.getAttribute("semantic");
            const source = inputEl.getAttribute("source").substring(1);
            const offset = parseInt(inputEl.getAttribute("offset"));
            inputs.push({
                semantic: semantic,
                offset: offset,
                source: semantic == "VERTEX" ? verticesSource : source
            });
        }
        const triangles: DaeGeometry["triangles"][number] = {
            count: count,
            inputs: inputs,
            indices: indices,
        }
        if (material !== null) {
            triangles.material = material
        }
        return triangles;
    }

    getById(id: string) {
        return this.geometries.find(geometry => {
            return geometry.id === id;
        });
    }
}