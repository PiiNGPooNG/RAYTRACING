import Job from './Job';
import Collada from "./collada/Collada.js";

const collada = await Collada.fromPath("/3d/donut.dae");

const width = 640;
const height = 360;
const displayFactor = 1;

const canvas = document.querySelector("canvas");
canvas.width = width * displayFactor;
canvas.height = height * displayFactor;
const ctx = canvas.getContext("2d");

const checkbox: HTMLInputElement = document.querySelector("#render-boxes");

const scaleX = canvas.width / width;
const scaleY = canvas.height / height;

const jobCanvas = new OffscreenCanvas(canvas.width, canvas.height);
const jobCtx = jobCanvas.getContext("2d");
jobCtx.fillStyle = "orange";

const offscreenCanvas = new OffscreenCanvas(width, height);
const offscreenCtx = offscreenCanvas.getContext("2d");

const sharedBuffer = new SharedArrayBuffer(width * height * 4);
const imageData = ctx.getImageData(0, 0, width, height);
const pixels = new Uint8ClampedArray(sharedBuffer);

const jobSize = 40;
const jobs: Array<Job> = [];

for (let x = 0; x < width; x += jobSize) {
    for (let y = 0; y < height; y += jobSize) {
        jobs.push({
            x: x,
            y: y,
            width: Math.min(jobSize, width - x),
            height: Math.min(jobSize, height - y)
        });
    }
}

jobs.reverse();

//jobs.sort(() => Math.random() - 0.5);

const workerAmount = 6;
const workers: Array<Worker> = [];
for (let i = 0; i < workerAmount; i++) {
    const worker = new Worker("/js/worker.js", {type: "module"});
    worker.postMessage({
        type: "setup",
        dae: collada.asObject(),
        width: width,
        height: height,
        buffer: sharedBuffer
    });
    workers.push(worker);
    worker.addEventListener("message", (message) => {
        let completedJob = message.data.completedJob;
        if (completedJob) {
            removeJobOutline(completedJob);
        }
        giveJob(worker);
    });
}

function giveJob(worker: Worker) {
    let job = jobs.pop();
    if (job) {
        const message = {
            type: "render",
            job: job
        };
        drawJobOutline(job);
        worker.postMessage(message);
    }
}

function drawJobOutline(job: Job) {
    let scaledJob = {
        x: Math.floor(job.x * scaleX),
        y: Math.floor(job.y * scaleY),
        width: Math.floor(job.width * scaleX),
        height: Math.floor(job.height * scaleY)
    }
    jobCtx.fillRect(scaledJob.x, scaledJob.y, scaledJob.width, scaledJob.height);
    jobCtx.clearRect(scaledJob.x + 1, scaledJob.y + 1, scaledJob.width - 2, scaledJob.height - 2);
}

function removeJobOutline(job: Job) {
    let scaledJob = {
        x: Math.floor(job.x * scaleX),
        y: Math.floor(job.y * scaleY),
        width: Math.floor(job.width * scaleX),
        height: Math.floor(job.height * scaleY)
    }
    jobCtx.clearRect(scaledJob.x, scaledJob.y, scaledJob.width, scaledJob.height);
}

function draw() {
    imageData.data.set(pixels);
    offscreenCtx.putImageData(imageData, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
    if (checkbox.checked) {
        ctx.drawImage(jobCanvas, 0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw)