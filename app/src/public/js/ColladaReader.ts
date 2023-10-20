import {SceneDto, TriangleDto, Vector3Dto} from "./SceneDto";
import Vector3 from "./Vector3.js";
import Matrix from "./Matrix.js";

export default class ColladaReader {
    #dae: Document;

    #scene: SceneDto;

    constructor() {

    }

    async open(filename: string) {
        const text = await this.#getFileContents(filename);
        this.#parse(text);
        this.#createScene();
    }

    async #getFileContents(filename: string): Promise<string> {
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

    #parse(text: string) {
        const parser = new DOMParser();
        this.#dae = parser.parseFromString(text, "text/xml");
    }

    #createScene(): void {
        const scene = this.#dae.querySelector("scene");
        const instanceVisualScene = scene.querySelector("instance_visual_scene");
        const visualScene = this.#dae.querySelector(instanceVisualScene.getAttribute("url"));

        const nodes = visualScene.querySelectorAll("node");

        this.#scene = {
            camera: null,
            materials: [],
            meshes: [],
            lights: []
        };

        for (const [number, node] of nodes.entries()) {
            let geometry = node.querySelector("instance_geometry");
            if (geometry) {
                this.#parseGeometryNode(node);
                continue;
            }
            let light = node.querySelector("instance_light");
            if (light) {
                this.#parseLightNode(node);
                continue;
            }
            let camera = node.querySelector("instance_camera");
            if (camera) {
                this.#parseCameraNode(node);
            }
        }
    }

    #parseGeometryNode(node: Element): void { // TODO: split up function
        const transform = node.querySelector("matrix").textContent.split(" ").map(Number);
        const tMatrix = Matrix.from1D(transform, 4, 4);
        const instanceGeometry = node.querySelector("instance_geometry");
        const geometry = this.#dae.querySelector(instanceGeometry.getAttribute("url"));

        const mesh = geometry.querySelector("mesh");

        // get vertices
        const positionsInput = mesh.querySelector("vertices input[semantic='POSITION']");

        const positions = mesh.querySelector(positionsInput.getAttribute("source"));
        const technique = positions.querySelector("technique_common");
        const accessor = technique.querySelector("accessor");

        const array = positions.querySelector(accessor.getAttribute("source")).textContent.split(" ").map(Number);
        const stride = parseInt(accessor.getAttribute("stride"));
        const vertices: Array<Vector3Dto> = [];
        for (let i = 0; i < array.length; i += stride) {
            let vertex = Vector3.fromArray(array.slice(i, i+3));
            vertex = tMatrix.transform(vertex);
            vertices.push({
                x: vertex.x,
                y: vertex.y,
                z: vertex.z
            });
        }

        // get triangles
        const trianglesNodes = mesh.querySelectorAll("triangles");
        const triangles: Array<TriangleDto> = [];

        for (const [_, trianglesNode] of trianglesNodes.entries()) {
            const material = this.#dae.querySelector("#" + trianglesNode.getAttribute("material")); // TODO: this isn't accessing the material properly
            let diffuse;
            if (material) {
                const effect = this.#dae.querySelector(material.querySelector("instance_effect").getAttribute("url"));
                diffuse = effect.querySelector("diffuse color").textContent.split(" ").map(Number)
            } else {
                diffuse = [0.5, 0.5, 0.5, 1];
            }
            const materialIndex = this.#scene.materials.push({r: diffuse[0], g: diffuse[1], b: diffuse[2], a: diffuse[3]}) - 1;
            const p = trianglesNode.querySelector("p").textContent.split(" ").map(Number);
            const inputs = trianglesNode.querySelectorAll("input");
            const vertexInput = trianglesNode.querySelector("input[semantic='VERTEX']");
            const vertexOffset = parseInt(vertexInput.getAttribute("offset"));
            for (let i = vertexOffset; i < p.length; i += inputs.length * 3) {
                let triangle: TriangleDto = {
                    vertices: [
                        vertices[p[i]],
                        vertices[p[i + inputs.length]],
                        vertices[p[i + inputs.length * 2]]
                    ],
                    material: materialIndex
                }
                triangles.push(triangle);
            }
        }

        this.#scene.meshes.push(triangles);
    }

    #parseLightNode(node: Element) {
        const transform = node.querySelector("matrix").textContent.split(" ").map(Number);
        const tMatrix = Matrix.from1D(transform, 4, 4);
        let lightPosition = new Vector3(0, 0, 0);
        lightPosition = tMatrix.transform(lightPosition);
        this.#scene.lights.push({
            position: {
                x: lightPosition.x,
                y: lightPosition.y,
                z: lightPosition.z
            }
        });
    }

    #parseCameraNode(node: Element) {
        const transform = node.querySelector("matrix").textContent.split(" ").map(Number);
        let tMatrix = Matrix.from1D(transform, 4, 4);

        const instance_camera = node.querySelector("instance_camera");
        const camera = this.#dae.querySelector(instance_camera.getAttribute("url"));

        let perspective = {
            xfov: parseFloat(camera.querySelector("xfov").textContent),
            aspectRatio: parseFloat(camera.querySelector("aspect_ratio").textContent),
            znear: parseFloat(camera.querySelector("znear").textContent),
            zfar: parseFloat(camera.querySelector("zfar").textContent),
        };

        this.#scene.camera = {
            transform: tMatrix.asArray,
            perspective: perspective
        };
    }

    get scene(): SceneDto {
        return this.#scene
    }
}