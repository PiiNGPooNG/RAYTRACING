import Renderer from "./Renderer.js";
import {DaeFull} from "./collada/ColladaTypes";
import {getScene} from "./build_scene.js";

let renderer: Renderer;

async function setup(dae: DaeFull, width: number, height: number, buffer: SharedArrayBuffer) {
    const scene = getScene(dae);
    renderer = new Renderer(width, height, 5, buffer);
    renderer.setScene(scene);
}

function render(startX: number, startY: number, width: number, height: number) {
    renderer.render(startX, startY, width, height);
}

self.onmessage = async (message) => {
    const data = message.data;
    if (data.type == "setup") {
        await setup(data.dae, data.width, data.height, data.buffer);
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
