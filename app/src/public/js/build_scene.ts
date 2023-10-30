import Collada from "./collada/Collada.js";
import Matrix from "./Matrix.js";
import Vector3 from "./Vector3.js";
import Scene from "./Scene.js";
import PointLight from "./PointLight.js";
import DirLight from "./DirLight.js";
import Mesh from "./Mesh.js";
import Color from "./Color.js";
import Triangle from "./Triangle.js";
import Vertex from "./Vertex.js";
import OrthoCamera from "./OrthoCamera.js";
import PerspectiveCamera from "./PerspectiveCamera.js";
import {DaeFull, DaeVisualScene} from "./collada/ColladaTypes";
import {Light} from "./types";
import Material from "./Material.js";


let collada: Collada;
let scene: Scene;

const defaultMaterial = new Material(new Color(0.5, 0.5, 0.5), 0);

export function getScene(object: DaeFull) {
    collada = Collada.fromObject(object)
    const colladaScene = collada.getScene();
    const visualScene = collada.getVisualScene(colladaScene.visual);
    scene = new Scene(getCamera(visualScene));

    for (const light of getLights(visualScene)) {
        scene.addLight(light);
    }

    for (const mesh of getMeshes(visualScene)) {
        scene.addMesh(mesh);
    }
    return scene;
}

function getCamera(visualScene: DaeVisualScene) {
    const cameraNode = visualScene.nodes.find(node => {
        return node.instances.map(instance => instance.type).includes("camera");
    });
    const transform = new Matrix(cameraNode.matrix);
    const instance = cameraNode.instances[0];
    const cameraObj = collada.getCamera(instance.url);
    const optics = cameraObj.optics;
    if (cameraObj.type === "orthographic") {
        return new OrthoCamera(optics.xmag, optics.aspectRatio, transform);
    } else if (cameraObj.type === "perspective") {
        return new PerspectiveCamera(optics.xfov, optics.aspectRatio, transform);
    }
}

function getLights(visualScene: DaeVisualScene) {
    const lights: Light[] = [];
    const lightNodes = visualScene.nodes.filter(node => {
        return node.instances.map(instance => instance.type).includes("light");
    });
    for (const lightNode of lightNodes) {
        const transform = new Matrix(lightNode.matrix);
        const instances = lightNode.instances.filter(instance => {
            return instance.type === "light";
        });
        for (const instance of instances) {
            const lightObj = collada.getLight(instance.url);
            const color = new Color(lightObj.color.r, lightObj.color.g, lightObj.color.b);
            if (lightObj.type === "directional") {
                const light = new DirLight(new Vector3(0, 0, 1), color, transform);
                lights.push(light);
            } else if (lightObj.type === "point") {
                const light = new PointLight(new Vector3(0, 0, 0), color, transform);
                lights.push(light);
            }
        }
    }
    return lights;
}

function getMeshes(visualScene: DaeVisualScene) {
    const meshes: Mesh[] = [];
    const meshNodes = visualScene.nodes.filter(node => {
        return node.instances.map(instance => instance.type).includes("geometry");
    });
    for (const meshNode of meshNodes) {
        const transform = new Matrix(meshNode.matrix);
        const instances = meshNode.instances.filter(instance => {
            return instance.type === "geometry";
        });
        for (const instance of instances) {
            const geometry = collada.getGeometry(instance.url);
            const materialMap = new Map<string, Material>();
            for (const materialNode of instance.materials ?? []) {
                const effect = collada.getEffectByMaterial(materialNode.target);
                if (effect.type === "lambert") {
                    const diffuse = effect.properties.diffuse;
                    const color = new Color(diffuse.r, diffuse.g, diffuse.b);
                    const reflectivity = effect.properties.reflectivity ?? 0;
                    const material = new Material(color, reflectivity);
                    materialMap.set(materialNode.symbol, material);
                }
            }
            for (const trianglesNode of geometry.triangles) {
                const inputCount = trianglesNode.inputs.length;
                const material = materialMap.get(trianglesNode.material) ?? defaultMaterial;
                const vertexInput = trianglesNode.inputs.find(input => input.semantic === "VERTEX");
                const vertices = geometry.sources.find(source => source.id === vertexInput.source).data;
                const normalInput = trianglesNode.inputs.find(input => input.semantic === "NORMAL");
                const normals = geometry.sources.find(source => source.id === normalInput.source).data;
                const indices = trianglesNode.indices;

                const triangles: Triangle[] = [];
                for (let i = 0; i < trianglesNode.count; i++) {
                    const index = i * 3 * inputCount;
                    triangles.push(new Triangle(
                        new Vertex(
                            Vector3.fromArray(vertices[indices[index + vertexInput.offset]]),
                            Vector3.fromArray(normals[indices[index + normalInput.offset]])
                        ),
                        new Vertex(
                            Vector3.fromArray(vertices[indices[index + inputCount + vertexInput.offset]]),
                            Vector3.fromArray(normals[indices[index + inputCount + normalInput.offset]])
                        ),
                        new Vertex(
                            Vector3.fromArray(vertices[indices[index + inputCount * 2 + vertexInput.offset]]),
                            Vector3.fromArray(normals[indices[index + inputCount * 2 + normalInput.offset]])
                        ),
                        material
                    ));
                }
                const mesh = new Mesh(triangles, transform);
                meshes.push(mesh);
            }
        }
    }
    return meshes;
}