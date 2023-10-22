import Collada from "./collada/Collada.js";
import Matrix from "./Matrix.js";
import Vector3 from "./Vector3.js";
import Scene from "./Scene.js";
import Camera from "./Camera.js";
import Light from "./Light.js";
import Mesh from "./Mesh.js";
import Color from "./Color.js";
import Triangle from "./Triangle.js";
import {DaeFull, DaeVisualScene} from "./collada/ColladaTypes";


let collada: Collada;
let scene: Scene;

const defaultColor = new Color(0.5, 0.5, 0.5);

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
    const optics = collada.getCamera(instance.url).optics;
    const camera = Camera.fromPerspective(optics.xfov, optics.aspectRatio, optics.znear, optics.zfar);
    camera.moveTo(transform);
    return camera;
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
            const light = new Light(new Vector3(0, 0, 0));
            light.transform(transform);
            lights.push(light);
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
            const materialMap = new Map();
            for (const material of instance.materials ?? []) {
                const effect = collada.getEffectByMaterial(material.target);
                if (effect.type === "lambert") {
                    const diffuse = effect.properties.diffuse;
                    const color = new Color(diffuse.r, diffuse.g, diffuse.b);
                    materialMap.set(material.symbol, color);
                }
            }
            for (const triangles of geometry.triangles) {
                const inputCount = triangles.inputs.length;
                const color = materialMap.get(triangles.material) ?? defaultColor;
                const vertexInput = triangles.inputs.find(input => input.semantic === "VERTEX");
                const vertices = geometry.sources.find(source => source.id === vertexInput.source).data;
                const normalInput = triangles.inputs.find(input => input.semantic === "NORMAL");
                const normals = geometry.sources.find(source => source.id === normalInput.source).data;
                const indices = triangles.indices;

                const actualTriangles: Triangle[] = [];
                for (let i = 0; i < triangles.count; i++) {
                    const index = i * 3 * triangles.inputs.length;
                    actualTriangles.push(new Triangle(
                        Vector3.fromArray(vertices[indices[index + vertexInput.offset]]),
                        Vector3.fromArray(vertices[indices[index + inputCount + vertexInput.offset]]),
                        Vector3.fromArray(vertices[indices[index + inputCount * 2 + vertexInput.offset]]),
                        color
                    ));
                }
                const mesh = new Mesh(actualTriangles);
                mesh.transform(transform);
                meshes.push(mesh);
            }
        }
    }
    return meshes;
}