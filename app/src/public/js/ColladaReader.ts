import {SceneDto, TriangleDto, Vector3Dto} from "./SceneDto";
import TransformationMatrix from "./TransformationMatrix.js";
import Vector3 from "./Vector3.js";

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
            camera: { // TODO: take from scene
                origin: {
                    x: -1.5,
                    y: -2,
                    z: -100
                },
                direction: {
                    x: 0,
                    y: 0,
                    z: 1
                }
            },
            materials: [],
            meshes: []
        };

        for (const [number, node] of nodes.entries()) {
            let geometry = node.querySelector("instance_geometry");
            if (geometry) {
                this.#parseGeometryNode(node);
            }
        }
    }

    #parseGeometryNode(node: Element): void {
        const transform = node.querySelector("matrix").textContent.split(" ").map(Number);
        const tMatrix = new TransformationMatrix(transform);
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
            vertex = tMatrix.getTransformed(vertex);
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
            const materialIndex = this.#scene.materials.push({r: 255, g: 0, b: 0, a: 255}) - 1;
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

    get scene(): SceneDto {
        return this.#scene
    }
}