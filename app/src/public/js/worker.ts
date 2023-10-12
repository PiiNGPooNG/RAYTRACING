import Vector3 from "./Vector3.js";
import {stlFileToTriangles} from './stlparser.js';
import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import Scene from "./Scene.js";
import Mesh from "./Mesh.js";

let renderer: Renderer;
let scene: Scene;

async function setup(buffer: SharedArrayBuffer) {
    scene = new Scene(
        new Camera(
            new Vector3(0, 0, -1000),
            new Vector3(0, 0, 1)
        )
    );
    let mesh = await Mesh.fromFile('/3d/wuerfel.stl');
    mesh.translate(new Vector3(250, 250, 180));
    scene.addMesh(mesh);
    renderer = new Renderer(500, 500, 300, buffer);
    renderer.setScene(scene);
}

function render(startX: number, startY: number, width: number, height: number) {
    renderer.render(startX, startY, width, height);
}

self.onmessage = async (message) => {
    const data = message.data;

    if (data.type == "setup") {
        await setup(data.buffer);
        self.postMessage({type: "ready"});
    } else if (data.type == "render") {
        render(data.x, data.y, data.width, data.height);
        self.postMessage({type: "ready"});
    }
}
