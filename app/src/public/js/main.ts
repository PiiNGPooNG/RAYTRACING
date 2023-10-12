const width = 500;
const height = 500;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const offscreenCanvas = new OffscreenCanvas(width, height);
const offscreenCtx = offscreenCanvas.getContext("2d");

const sharedBuffer = new SharedArrayBuffer(width * height * 4);
const imageData = ctx.getImageData(0, 0, width, height);
const pixels = new Uint8ClampedArray(sharedBuffer);

interface Job {
    x: number;
    y: number;
    width: number;
    height: number;
}

const jobs: Array<Job> = [];

for (let x = 0; x < width; x += 60) {
    for (let y = 0; y < height; y += 60) {
        jobs.push({
            x: x,
            y: y,
            width: Math.min(60, width - x),
            height: Math.min(60, height - y)
        });
    }
}

const workerAmount = 6;
const workers: Array<Worker> = [];
for (let i = 0; i < workerAmount; i++) {
    const worker = new Worker("/js/worker.js", {type: "module"});
    worker.postMessage({
        type: "setup",
        buffer: sharedBuffer
    });
    workers.push(worker);
    worker.addEventListener("message", (message) => {
        giveJob(worker);
    });
}

function giveJob(worker: Worker) {
    let job = jobs.pop();
    const message = {
        type: "render",
        ...job
    };
    worker.postMessage(message);
}

function draw() {
    imageData.data.set(pixels);
    offscreenCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw)