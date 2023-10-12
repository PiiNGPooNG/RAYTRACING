import Color from "./Color.js";
import Vector3 from "./Vector3.js";
import Ray from "./Ray.js";
import {stlFileToTriangles} from './stlparser.js';
import Renderer2 from "./Renderer2.js";

const width = 500;
const height = 500;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const offscreenCanvas = new OffscreenCanvas(width, height);
const offscreenCtx = offscreenCanvas.getContext("2d");

const sharedBuffer = new SharedArrayBuffer(width * height * 4);
const imageData = ctx.getImageData(0, 0, width, height);
const pixels = new Uint8ClampedArray(sharedBuffer);

let renderer = new Renderer2(500, 500, 300, sharedBuffer);

let triangles = await stlFileToTriangles('/3d/wuerfel.stl', new Vector3(250, 250, 180));

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        let ray = new Ray(new Vector3(x, y, -10000), new Vector3(0, 0 ,1));
        triangles.forEach((triangle) => {
           ray.calcIntersection(triangle);
        });
        let intersection = ray.intersection;
        if (intersection) {
            let color = ray.intersectedTriangle.color;
            renderer.depthPixel(x, y, ray.intersection.z, color);
        }
    }
    imageData.data.set(pixels);
    offscreenCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
}

console.log("Done");