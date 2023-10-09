import {Canvas, Color, Vector3, Ray} from "./renderer.js";
import {stlFileToTriangles} from './stlparser.js';

let canvasEl = document.querySelector("canvas");

let canvas = new Canvas(canvasEl, 500, 500, 300, new Color(255, 255, 255));

let triangles = await stlFileToTriangles('/3d/wuerfel.stl', new Vector3(250, 250, 180));

for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
        let ray = new Ray(new Vector3(x, y, -10000), new Vector3(0, 0 ,1));
        triangles.forEach((triangle) => {
           ray.calcIntersection(triangle);
        });
        let intersection = ray.intersection;
        if (intersection) {
            let color = ray.intersectedTriangle.color;
            canvas.depthPixel(x, y, ray.intersection.z, color);
        }
    }
}