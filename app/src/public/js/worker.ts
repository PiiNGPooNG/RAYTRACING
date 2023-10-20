import Vector3 from "./Vector3.js";
import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import Scene from "./Scene.js";
import Mesh from "./Mesh.js";
import Job from "./Job";
import {SceneDto} from "./SceneDto";
import Triangle from "./Triangle.js";
import Color from "./Color.js";
import Light from "./Light.js";
import PerspectiveCamera from "./PerspectiveCamera.js";
import Matrix from "./Matrix.js";

let renderer: Renderer;
let scene: Scene;

async function setup(sceneDto: SceneDto, width: number, height: number, buffer: SharedArrayBuffer) {
    const cameraDto = sceneDto.camera;
    const camera = new PerspectiveCamera(
        cameraDto.perspective.xfov,
        cameraDto.perspective.aspectRatio,
        cameraDto.perspective.znear,
        cameraDto.perspective.zfar
    );
    camera.transform = new Matrix(cameraDto.transform);
    scene = new Scene(camera);

    sceneDto.meshes.forEach((meshDto) => {
        let triangles: Array<Triangle> = [];
        meshDto.forEach((triangleDto) => {
            let material = sceneDto.materials[triangleDto.material];
            let triangle = new Triangle(
                new Vector3(triangleDto.vertices[0].x, triangleDto.vertices[0].y, triangleDto.vertices[0].z),
                new Vector3(triangleDto.vertices[1].x, triangleDto.vertices[1].y, triangleDto.vertices[1].z),
                new Vector3(triangleDto.vertices[2].x, triangleDto.vertices[2].y, triangleDto.vertices[2].z),
                new Color(material.r, material.g, material.b)
            );
            triangles.push(triangle);
        });
        const mesh = new Mesh(triangles);
        scene.addMesh(new Mesh(triangles));
    });

    sceneDto.lights.forEach((lightDto) => {
        scene.addLight(new Light(new Vector3(lightDto.position.x, lightDto.position.y, lightDto.position.z)))
    });

    renderer = new Renderer(width, height, 5, buffer);
    renderer.setScene(scene);
}

function render(startX: number, startY: number, width: number, height: number) {
    renderer.render(startX, startY, width, height);
}

self.onmessage = async (message) => {
    const data = message.data;
    if (data.type == "setup") {
        await setup(data.scene, data.width, data.height, data.buffer);
        self.postMessage({type: "ready"});
    } else if (data.type == "render") {
        const job = data.job;
        render(job.x, job.y, job.width, job.height);
        self.postMessage({
            type: "ready",
            completedJob: job
        });
    }
}
