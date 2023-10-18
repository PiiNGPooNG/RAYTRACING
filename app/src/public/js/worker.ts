import Vector3 from "./Vector3.js";
import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import Scene from "./Scene.js";
import Mesh from "./Mesh.js";
import Job from "./Job";
import {SceneDto} from "./SceneDto";
import Triangle from "./Triangle.js";
import Color from "./Color.js";
import * as wasi from "wasi";

let renderer: Renderer;
let scene: Scene;

async function setup(sceneDto: SceneDto, buffer: SharedArrayBuffer) {
    const cameraDto = sceneDto.camera;
    scene = new Scene(
        new Camera(
            new Vector3(cameraDto.origin.x, cameraDto.origin.y, cameraDto.origin.z),
            new Vector3(cameraDto.direction.x, cameraDto.direction.y, cameraDto.direction.z),
        )
    );

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
        mesh.translate(new Vector3(0, 0, 2));
        scene.addMesh(new Mesh(triangles));
    });

    renderer = new Renderer(500, 500, 5, buffer); // TODO: probably should get params from main
    renderer.setScene(scene);
}

function render(startX: number, startY: number, width: number, height: number) {
    renderer.render(startX, startY, width, height);
}

self.onmessage = async (message) => {
    const data = message.data;
    if (data.type == "setup") {
        await setup(data.scene, data.buffer);
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
