import {Color, Triangle, Vector3} from "./renderer.js";

export async function stlFileToText(filename: string): Promise<string> {
    let file = await fetch(filename);
    let blob = await file.blob();
    const reader = new FileReader();
    return new Promise(function (resolve) {
        reader.addEventListener('load', () => {
            let text = reader.result as string;
            resolve(text);
        });
        if (blob) {
            reader.readAsText(blob);
        }
    });
}

export function stlTextToTriangles(text: string, shift: Vector3): Array<Triangle> {
    let triangles: Array<Triangle> = [];
    let facets = text.match(/facet\s+normal(?:\s+[-+]?[0-9]+\.[0-9]+){3}\s+outer\s+loop\s+(?:vertex(?:\s+[-+]?[0-9]+\.[0-9]+){3}\s+){3}endloop\s+endfacet\s+/g);
    facets.forEach((facet) => {
        //let normal = facet.match(/facet\s+normal\s+([-+]?[0-9]+\.[0-9]+)\s+([-+]?[0-9]+\.[0-9]+)\s+([-+]?[0-9]+\.[0-9]+)/);

        let vertices = facet.matchAll(/vertex\s([-+]?[0-9]+\.[0-9]+)\s([-+]?[0-9]+\.[0-9]+)\s([-+]?[0-9]+\.[0-9]+)/g);
        let vectors = [];
        for (const vertex of vertices) {
            let vector = new Vector3(parseFloat(vertex[1]), parseFloat(vertex[2]), parseFloat(vertex[3]));
            vectors.push(vector.add(shift));
        }
        triangles.push(new Triangle(vectors[0], vectors[1], vectors[2], new Color(255, 0, 0)));
    });
    return triangles;
}

export async function stlFileToTriangles(filename: string, shift: Vector3) {
    let text = await stlFileToText(filename);
    return stlTextToTriangles(text, shift);
}