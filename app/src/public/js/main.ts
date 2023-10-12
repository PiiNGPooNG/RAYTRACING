const width = 500;
const height = 500;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const offscreenCanvas = new OffscreenCanvas(width, height);
const offscreenCtx = offscreenCanvas.getContext("2d");

const sharedBuffer = new SharedArrayBuffer(width * height * 4);
const imageData = ctx.getImageData(0, 0, width, height);
const pixels = new Uint8ClampedArray(sharedBuffer);

const worker = new Worker("/js/worker.js", {type: "module"});
worker.postMessage({
    x: 0,
    y: 0,
    width: width,
    height: height,
    buffer: sharedBuffer
})

function draw() {
    imageData.data.set(pixels);
    offscreenCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw)